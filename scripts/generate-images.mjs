import { readdir, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "photo";
const OUTPUT_DIR = "public/photo";
const MANIFEST_PATH = "src/data/photos.json";

const THUMB_WIDTH = 600;
const THUMB_QUALITY = 60;
const HD_WIDTH = 2000;
const HD_QUALITY = 80;

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function listAlbums(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function listPhotos(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && IMAGE_EXT.has(extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function generateVariant(srcPath, destPath, width, quality) {
  const image = sharp(srcPath).rotate();
  const metadata = await image.metadata();
  const targetWidth = Math.min(width, metadata.width ?? width);

  await image
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath);

  return sharp(destPath).metadata();
}

async function processAlbum(album) {
  const srcDir = join(SOURCE_DIR, album);
  const thumbDir = join(OUTPUT_DIR, album, "thumb");
  const hdDir = join(OUTPUT_DIR, album, "hd");
  await mkdir(thumbDir, { recursive: true });
  await mkdir(hdDir, { recursive: true });

  const files = await listPhotos(srcDir);
  const photos = [];

  for (const file of files) {
    const srcPath = join(srcDir, file);
    const name = basename(file, extname(file));
    const thumbPath = join(thumbDir, `${name}.webp`);
    const hdPath = join(hdDir, `${name}.webp`);

    const [, hdMeta] = await Promise.all([
      generateVariant(srcPath, thumbPath, THUMB_WIDTH, THUMB_QUALITY),
      generateVariant(srcPath, hdPath, HD_WIDTH, HD_QUALITY),
    ]);

    photos.push({
      id: name,
      thumb: `/photo/${album}/thumb/${name}.webp`,
      hd: `/photo/${album}/hd/${name}.webp`,
      width: hdMeta.width,
      height: hdMeta.height,
    });

    console.log(`  ${album}/${file} -> ${photos.length} done`);
  }

  return photos;
}

async function main() {
  const albums = await listAlbums(SOURCE_DIR);
  const manifest = {};

  for (const album of albums) {
    console.log(`Album: ${album}`);
    manifest[album] = await processAlbum(album);
  }

  await mkdir("src/data", { recursive: true });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\nManifest written to ${MANIFEST_PATH}`);
  for (const [album, photos] of Object.entries(manifest)) {
    console.log(`  ${album}: ${photos.length} photos`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
