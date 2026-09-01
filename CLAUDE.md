# Pray Trinity (formerly Trinity Prayers)

Expo / React Native mobile app (iOS + Android) for sharing parish prayer intentions.

## Architecture

Expo client talking to two backends, both live:

- **Supabase** (`supabase.ts`, `environment.ts`, `context/UserContextProvider.ts`):
  auth (email/password, anonymous), user metadata (name, church), session storage.
- **Spring Boot + Postgres** (`trinity-prayer-server/`, deployed to a DigitalOcean
  droplet at `api.trinityprayer.org`, Terraform in `infrastructure/`): prayer
  intentions, churches, push notifications via Expo push. The client calls it
  through the OpenAPI client in `generated-sdk/` (`sdk.ts`, `generate-sdk.sh`,
  `openapitools.json`), authenticated with the Supabase JWT.
- `public/` are the static pages on trinityprayer.org (privacy policy, email
  confirmation), deployed with `deploy-static-files.sh`; `deploy-trinity.sh`
  redeploys the server.

The app started on Firebase and moved to Supabase + Spring in 2025
(`290cc4d`..`9f131b1`). Firebase is only needed for Android push (FCM); there is
no plan to move back.

## Stack

- Expo SDK 57, React Native 0.86, React 19, Expo Router (file routes in `app/`)
- TypeScript 6 (`strict`), ESLint via `eslint-config-expo` flat config
- `expo-notifications` for push, `expo-audio` for the background chant
- New Architecture only (SDK 57 has no legacy-arch option)

## Commands

```bash
npm install
npx expo start                 # dev server; use a development build, not Expo Go
npm run typecheck              # tsc --noEmit
npm run lint                   # expo lint
npm run doctor                 # expo-doctor, must be 21/21
npx expo export --platform ios --platform android --output-dir dist   # bundle smoke test
```

Always add or upgrade Expo-managed packages with `npx expo install <pkg>` and
`npx expo install --fix`; never hand-pin versions of `expo-*`, `react-native`,
`react`, or `react-native-screens`.

## Layout

- `app/` — routes: `index`, `landing`, `sign-in`, `sign-up`, `inbox`, `settings`,
  `create-prayer-intention`, `prayer-intentions/[id]`, `+not-found`
- `app/_layout.tsx` — root Stack, theme, fonts, push-notification response handler
- `components/`, `hooks/`, `constants/Colors.ts`, `context/`
- `assets/images/` — `icon.png` (1024²), `adaptive-icon.png`, `favicon.png`,
  `background.png` (splash); `assets/audio/gregorian-chant.mp3`
- `app.config.ts` — single source of app config; bump `version` here
- `eas.json` — EAS build/submit profiles

## Store distribution

Bundle ID / package: `net.trinity.prayers.app`. Apple team: Trinity Prayer Inc,
team ID `DPT5Y32WM4` (organization; erfangc@gmail.com is Admin). EAS project
`e5ba8825-…` under Expo account `erfangc` (`eas whoami` must say erfangc).
Version source is remote: `eas build` auto-increments build numbers.

History: the app first shipped as `org.trinity.prayers.app` from the Trendi LLC
Apple team (App Store Connect app 6742467074, v1.1.1 released, v1.1.2 in review).
That membership lapsed on 2026-09-01, the app was pulled from the store, and the
old bundle ID and the App Store name "Trinity Prayers" are still held by that
record. The project moved to a fresh bundle ID under Trinity Prayer Inc rather
than transferring the app.

Done on the Apple side (2026-09-01):

- App ID `net.trinity.prayers.app` registered with Push Notifications.
- Program License Agreement accepted for Trinity Prayer Inc.

App Store Connect app "Pray Trinity" (Apple ID `6807541061`, SKU
`pray-trinity-ios`, bundle `net.trinity.prayers.app`) exists under Trinity
Prayer Inc; `eas.json` submit profile points at it. The App Store name
"Trinity Prayers" is still locked by the old Trendi record (renamed to
"Trinity Prayers (legacy)"; Apple refuses to remove it while that membership
is expired), so the app is now called Pray Trinity in `app.config.ts` too.

## Release pipeline

`.github/workflows/store-release.yml` runs on every push to `main` that touches
`app.config.ts`. If the `version` literal changed it runs `eas build --profile
production --auto-submit` on EAS servers and then `eas metadata:push`, so a
release is: bump `version` in `app.config.ts`, merge to `main`, and press
"Add for Review" in App Store Connect once the build has processed. Manual
dispatch of the workflow builds without a bump. The `RELEASE_PLATFORM` repo
variable (`ios` today) chooses the platforms; flip it to `all` once Play is set
up. The only GitHub secret is `EXPO_TOKEN` (an erfangc Expo access token).

Everything else lives on EAS servers, created once with `eas credentials`:

- iOS distribution certificate + App Store provisioning profile
- APNs push key
- App Store Connect API key (used by `eas submit` and `eas metadata`)
- Google service account key for Play (`eas credentials -p android`)

Store listing text, keywords, category, age rating, release options and the
screenshot list live in `store.config.js` (EAS Metadata). It reads the version
from `app.config.ts` so the App Store version record always matches the build.
`npm run metadata:push` syncs it by hand; `eas metadata:lint` validates it.

Store images:

```bash
npm run ios                      # one-time: build + install the dev client on the simulator
npx expo start --port 8083       # keep running in another terminal
npm run capture:ios              # 1320x2868 captures -> store-assets/ios/
npm run store-assets             # icons, Play feature graphic, Play screenshots
```

`capture:ios` uses Facebook's idb to dismiss the iOS deep-link prompt; see the
header of `scripts/capture-ios-screenshots.mjs`.

Still open on the user side:

- App Store Connect > App Review: contact name/phone and a demo account for the
  reviewer (sign-in is required to reach the main screen).
- Google Play: erfangc@gmail.com has no Play Console developer account. Create
  one, create the app, upload the first AAB by hand, then store the service
  account key with `eas credentials -p android` and set `RELEASE_PLATFORM=all`.
- Android push: `google-services.json` from the Firebase console in the repo
  root (or `GOOGLE_SERVICES_JSON` pointing at an EAS file secret), and the FCM V1
  key uploaded with `eas credentials`.

```bash
eas build -p ios -e production --auto-submit
eas build -p android -e production --auto-submit
```
