#!/usr/bin/env node
// Captures App Store screenshots by booting the iPhone 17 Pro Max simulator,
// deep-linking to each screen in SCREENS, and writing native-resolution PNGs
// (1320x2868, Apple's 6.9-inch class) to store-assets/ios/. Those files are
// referenced from store.config.json and uploaded by `eas metadata:push`.
//
// Prerequisites (one-time):
//   1. The app is installed on the simulator: `npm run ios` builds and installs
//      it (a dev client), and `npx expo start --port 8083` must be running so
//      the client has JavaScript to load. Pass --metro-url to point the client
//      elsewhere.
//   2. Sign in inside the app if you want screens that need an account. The
//      script pauses before capture so you can check; --no-prompt skips that.
//   3. iOS 26 sometimes asks "Open in Pray Trinity?" for a deep link sent with
//      `simctl openurl`. If Facebook's idb is installed the script finds that
//      alert through the accessibility tree and taps Open itself
//      (brew tap facebook/fb && brew install idb-companion && pip3 install
//      --user --break-system-packages fb-idb); otherwise tap it by hand.
//
// Usage:
//   npm run capture:ios
//   npm run capture:ios -- --no-prompt
//   npm run capture:ios -- --metro-url http://localhost:8081

import {execSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {createInterface} from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'store-assets/ios');
const BUNDLE_ID = 'net.trinity.prayers.app';
const SCHEME = 'trinity';

// Apple's "6.9-inch display" class accepts 1320x2868, which the iPhone 17 Pro
// Max (and 16 Pro Max) simulator produces natively.
const DEVICE = {name: 'iPhone 17 Pro Max', width: 1320, height: 2868, filePrefix: 'iphone-6.9'};

// Order = display order on the store listing. `url` is the Expo Router path.
const SCREENS = [
    {name: '01-welcome', url: ''},
    {name: '02-landing', url: 'landing'},
    {name: '03-request-a-prayer', url: 'create-prayer-intention'},
    {name: '04-sign-up', url: 'sign-up'},
];

const argv = process.argv.slice(2);
const flag = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : null;
};
const metroUrl = flag('--metro-url') || 'http://localhost:8083';
const noPrompt = argv.includes('--no-prompt') || process.env.SCREENSHOT_SKIP_PROMPT === '1';

const log = (msg) => console.log(`\x1b[36m[capture-ios]\x1b[0m ${msg}`);
const sh = (cmd) => execSync(cmd, {stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8'});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findIdb() {
    for (const cmd of ['idb', `${process.env.HOME}/Library/Python/3.13/bin/idb`]) {
        try {
            sh(`"${cmd}" --help`);
            return cmd;
        } catch {}
    }
    return null;
}

function findUdid(name) {
    const list = JSON.parse(sh('xcrun simctl list devices available --json'));
    const matches = [];
    for (const [runtime, devices] of Object.entries(list.devices)) {
        if (!runtime.includes('iOS')) continue;
        for (const d of devices) if (d.name === name) matches.push({...d, runtime});
    }
    if (matches.length === 0) return null;
    const booted = matches.find((d) => d.state === 'Booted');
    if (booted) return booted.udid;
    matches.sort((a, b) => b.runtime.localeCompare(a.runtime, undefined, {numeric: true}));
    return matches[0].udid;
}

function bootDevice(name) {
    const udid = findUdid(name);
    if (!udid) throw new Error(`Simulator "${name}" not found. Install it via Xcode > Settings > Components.`);
    log(`Booting ${name} (${udid})...`);
    try {
        sh(`xcrun simctl boot "${udid}"`);
    } catch (e) {
        if (!String(e.stderr || e.message).includes('Booted')) throw e;
    }
    sh(`xcrun simctl bootstatus "${udid}" -b`);
    return udid;
}

async function waitForUser() {
    if (noPrompt) return;
    const rl = createInterface({input, output});
    console.log('\n  The app is open on the simulator. Sign in if the screens you want need it.\n');
    await rl.question('  Press ENTER to begin capture, or Ctrl+C to abort. ');
    rl.close();
}

async function main() {
    const udid = bootDevice(DEVICE.name);
    sh('open -a Simulator');
    const idb = findIdb();
    if (idb) sh(`"${idb}" connect ${udid}`);
    else log('idb not found; tap "Open" on the simulator yourself whenever iOS asks to open a link.');

    // Taps the "Open" button of the deep-link confirmation alert if it is on
    // screen. Only buttons found in the accessibility tree are tapped, so a
    // screen without the alert is left untouched.
    const confirmOpen = async () => {
        await sleep(1200);
        if (!idb) {
            await sleep(4000);
            return;
        }
        for (let attempt = 0; attempt < 3; attempt++) {
            const tree = JSON.parse(sh(`"${idb}" ui describe-all --udid ${udid}`));
            const button = tree.find((e) => e.type === 'Button' && e.AXLabel === 'Open');
            if (!button) return;
            const {x, y, width, height} = button.frame;
            sh(`"${idb}" ui tap --udid ${udid} ${Math.round(x + width / 2)} ${Math.round(y + height / 2)}`);
            await sleep(1200);
        }
    };

    // Dev-client preferences: skip the first-launch onboarding sheet and hide
    // the floating dev-menu button so neither ends up in a screenshot.
    sh(`xcrun simctl spawn "${udid}" defaults write ${BUNDLE_ID} EXDevMenuIsOnboardingFinished -bool YES`);
    sh(`xcrun simctl spawn "${udid}" defaults write ${BUNDLE_ID} EXDevMenuShowFloatingActionButton -bool NO`);

    // Pin a clean status bar; reviewers and shoppers see it verbatim.
    sh(
        `xcrun simctl status_bar "${udid}" override --time "9:41" ` +
        `--dataNetwork wifi --wifiMode active --wifiBars 3 ` +
        `--cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100`,
    );

    // The installed app is a dev client: hand it the Metro URL so it loads the bundle.
    const devClientUrl = `exp+${SCHEME}://expo-development-client/?url=${encodeURIComponent(metroUrl)}`;
    log(`Launching ${BUNDLE_ID} against ${metroUrl}...`);
    try {
        sh(`xcrun simctl terminate "${udid}" "${BUNDLE_ID}"`); // fresh start: the first capture is the initial route
    } catch {}
    sh(`xcrun simctl launch "${udid}" "${BUNDLE_ID}"`);
    await sleep(1500);
    sh(`xcrun simctl openurl "${udid}" "${devClientUrl}"`);
    await confirmOpen();
    await sleep(8000); // first bundle load

    await waitForUser();
    mkdirSync(OUT_DIR, {recursive: true});
    const {default: sharp} = await import('sharp');

    log(`Capturing ${SCREENS.length} screen(s) at ${DEVICE.width}x${DEVICE.height}...`);
    for (const screen of SCREENS) {
        if (screen.url !== '') {
            sh(`xcrun simctl openurl "${udid}" "${SCHEME}://${screen.url}"`);
            await confirmOpen();
        }
        await sleep(2000);
        const out = resolve(OUT_DIR, `${DEVICE.filePrefix}-${screen.name}.png`);
        sh(`xcrun simctl io "${udid}" screenshot "${out}"`);
        const meta = await sharp(out).metadata();
        if (meta.width !== DEVICE.width || meta.height !== DEVICE.height) {
            throw new Error(`${out} is ${meta.width}x${meta.height}, expected ${DEVICE.width}x${DEVICE.height}.`);
        }
        log(`  ${meta.width}x${meta.height}  ${out}`);
    }

    sh(`xcrun simctl status_bar "${udid}" clear`);
    log('Done. Run `npm run store-assets` to derive the Play Store set.');
}

main().catch((e) => {
    console.error(`\x1b[31m[capture-ios]\x1b[0m ${e.message}`);
    process.exit(1);
});
