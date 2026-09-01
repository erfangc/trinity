#!/usr/bin/env node
// Derives every store image that is not a raw simulator capture:
//
//   store-assets/ios/app-icon-1024.png        App Store icon, no alpha (Apple rejects transparency)
//   store-assets/android/play-icon-512.png    Play Store icon
//   store-assets/android/feature-graphic-1024x500.png
//   store-assets/android/phone-*.png          1080x1920 phone screenshots (Play caps the aspect
//                                             ratio at 2:1, so the 6.9-inch captures are fitted
//                                             onto a 9:16 canvas)
//
// Sources: assets/images/icon.png, assets/images/background.png and the iPhone
// captures written by scripts/capture-ios-screenshots.mjs. Re-run after any of
// those change and commit the output.

import {Buffer} from 'node:buffer';
import {mkdirSync, readdirSync} from 'node:fs';
import {basename, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ICON = resolve(ROOT, 'assets/images/icon.png');
const BACKGROUND = resolve(ROOT, 'assets/images/background.png');
const IOS = resolve(ROOT, 'store-assets/ios');
const ANDROID = resolve(ROOT, 'store-assets/android');
const BG = '#12100D'; // app primaryColor

let sharp;
try {
    ({default: sharp} = await import('sharp'));
} catch {
    console.error('[store-assets] `sharp` is not installed. Run `npm install` first.');
    process.exit(1);
}

const log = (msg) => console.log(`\x1b[36m[store-assets]\x1b[0m ${msg}`);
mkdirSync(IOS, {recursive: true});
mkdirSync(ANDROID, {recursive: true});

async function write(pipeline, out) {
    await pipeline.png().toFile(out);
    const {width, height} = await sharp(out).metadata();
    log(`  ${width}x${height}  ${out}`);
}

// Icons. flatten() drops any alpha channel; Apple applies its own corner mask.
await write(sharp(ICON).resize(1024, 1024).flatten({background: BG}), resolve(IOS, 'app-icon-1024.png'));
await write(sharp(ICON).resize(512, 512).flatten({background: BG}), resolve(ANDROID, 'play-icon-512.png'));

// Feature graphic: the splash background cropped to 1024x500 with the icon and
// app name composited on the right, where the candle sits.
{
    const W = 1024, H = 500;
    const bg = await sharp(BACKGROUND).resize(W, H, {fit: 'cover', position: 'centre'}).modulate({brightness: 0.85}).toBuffer();
    const icon = await sharp(ICON).resize(260, 260).toBuffer();
    const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="360" y="215" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="#F3E9D2" font-weight="bold">Pray Trinity</text>
  <text x="362" y="285" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#D9CDB0">Prayer intentions for your parish</text>
</svg>`);
    await write(
        sharp(bg).composite([
            {input: icon, left: 70, top: 120},
            {input: text, left: 0, top: 0},
        ]),
        resolve(ANDROID, 'feature-graphic-1024x500.png'),
    );
}

// Play phone screenshots: fit each iPhone capture inside a 1080x1920 canvas.
const captures = readdirSync(IOS).filter((f) => /^iphone-6\.9-\d+-.*\.png$/.test(f)).sort();
if (captures.length === 0) {
    log('No iPhone captures in store-assets/ios yet; run `npm run capture:ios` first. Skipping Play screenshots.');
} else {
    for (const file of captures) {
        const out = resolve(ANDROID, basename(file).replace(/^iphone-6\.9-/, 'phone-'));
        const inner = await sharp(resolve(IOS, file)).resize({height: 1920, fit: 'inside'}).toBuffer();
        await write(
            sharp({create: {width: 1080, height: 1920, channels: 3, background: BG}}).composite([{input: inner, gravity: 'centre'}]),
            out,
        );
    }
}
log('Done.');
