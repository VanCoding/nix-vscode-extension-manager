import axios from "axios";
import { readFile, writeFile, readdir } from "fs-extra";
import crypto from "crypto";
import zip from "jszip";
import path from "path";

const FILE_PATH = "./vscode-extensions.json";

type ExtensionIdentifier = {
  publisher: string;
  name: string;
};

type ExtensionEntry = ExtensionIdentifier & {
  sha256: string;
  version: string;
};

async function downloadExtension(extension: ExtensionIdentifier) {
  const response = await axios.get(
    `https://${extension.publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${extension.publisher}/extension/${extension.name}/latest/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`,
    {
      responseType: "arraybuffer",
    }
  );
  return Buffer.from(response.data);
}

function getExtensionHash(data: Buffer) {
  const hash = crypto.createHash("sha256");
  hash.write(data);
  return hash.digest().toString("hex");
}

async function getExtensionVersion(data: Buffer) {
  const archive = await zip.loadAsync(data);
  const packageJsonString = await archive
    .file("extension/package.json")!
    .async("string");
  const packageJson = JSON.parse(packageJsonString);
  return packageJson.version as string;
}

async function getExtensionInfo(extension: ExtensionIdentifier) {
  const archive = await downloadExtension(extension);
  return {
    ...extension,
    sha256: getExtensionHash(archive),
    version: await getExtensionVersion(archive),
  };
}

async function readExtensions() {
  try {
    const content = await readFile(FILE_PATH);
    return JSON.parse(content + "") as ExtensionEntry[];
  } catch (e) {
    console.log("directory is not initialized yet. run init first.");
    process.exit(1);
  }
}

async function writeExtensions(entries: ExtensionEntry[]) {
  await writeFile(FILE_PATH, JSON.stringify(entries, null, "  "));
}

export async function init() {
  await writeExtensions([]);
  console.log("created file vscode-extensions.json");
}

export function parseExtensionIdentifier(extensionIdentifier: string) {
  const parts = extensionIdentifier.split("/");
  return {
    publisher: parts[0],
    name: parts[1],
  };
}

function compareExtensionIdentifiers(
  a: ExtensionIdentifier,
  b: ExtensionIdentifier
) {
  return a.publisher == b.publisher && a.name == b.name;
}

function extensionsAreEqual(a: ExtensionEntry, b: ExtensionEntry) {
  return compareExtensionIdentifiers(a, b) && a.sha256 == b.sha256;
}

function findExistingExtension(
  extensions: ExtensionEntry[],
  extension: ExtensionIdentifier
) {
  return extensions.find((e) => compareExtensionIdentifiers(e, extension));
}

function renderExtensionIdentifier(extension: ExtensionIdentifier) {
  return extension.publisher + "/" + extension.name;
}

function renderExtension(extension: ExtensionEntry) {
  return renderExtensionIdentifier(extension) + "@" + extension.version;
}

export async function install(extension: ExtensionIdentifier) {
  const extensions = await readExtensions();
  const existing = findExistingExtension(extensions, extension);
  if (existing) {
    throw new Error("extension is already installed");
  }
  const info = await getExtensionInfo(extension);

  const newExtensions = [...extensions, info];
  await writeExtensions(newExtensions);
  console.log("installed", renderExtension(info));
}

export async function update(extension: ExtensionIdentifier) {
  const extensions = await readExtensions();
  const existing = findExistingExtension(extensions, extension);
  if (!existing) {
    throw new Error("extension is not installed");
  }
  const info = await getExtensionInfo(extension);
  if (extensionsAreEqual(existing, info)) {
    console.log(renderExtension(info), "is already up to date");
    return;
  }
  const newExtensions = extensions.map((e) =>
    compareExtensionIdentifiers(e, extension) ? info : e
  );
  await writeExtensions(newExtensions);
  console.log("installed", renderExtension(info));
}

export async function uninstall(extension: ExtensionIdentifier) {
  const extensions = await readExtensions();
  const existing = findExistingExtension(extensions, extension);
  if (!existing) {
    throw new Error("extension is not installed");
  }
  const newExtensions = extensions.filter(
    (e) => !compareExtensionIdentifiers(e, extension)
  );
  await writeExtensions(newExtensions);
  console.log("uninstalled", renderExtension(existing));
}

export async function updateAll() {
  const extensions = await readExtensions();
  for (var extension of extensions) {
    await update(extension);
  }
}

export async function detect(dir: string = "~/.vscode/extensions") {
  await init();
  const extensionDirs = await readdir(dir);
  for (const extensionDir of extensionDirs) {
    const info = JSON.parse(
      (await readFile(path.resolve(dir, extensionDir, "package.json"))) + ""
    );
    await install({
      publisher: info.publisher,
      name: info.name,
    });
  }
}
