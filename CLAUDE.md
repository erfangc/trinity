# Pray Trinity (formerly Trinity Prayers)

Expo / React Native mobile app (iOS + Android) for sharing parish prayer intentions.

## Architecture rule

**This is strictly a Firebase mobile app.** The client talks to Firebase directly
(Auth, Firestore, Cloud Messaging via Expo push). There is no custom backend to
build, deploy, or extend. Do not add servers, ORMs, Terraform, or generated API
clients.

Legacy caveat: the repo still carries a 2025 detour away from Firebase. Treat all
of this as legacy to be removed, not extended:

- `supabase.ts`, `environment.ts`, `context/UserContextProvider.ts` — Supabase auth
- `sdk.ts`, `generated-sdk/`, `generate-sdk.sh`, `openapitools.json` — OpenAPI client
- `trinity-prayer-server/` — Spring Boot server; `deploy-*.sh` — its deploy scripts
- `infrastructure/` — Terraform for a DigitalOcean droplet
- `public/` — hand-written static pages (privacy policy, email confirm)

Firebase history lives in git (`git log -S firebase`); the Firebase→Supabase move
was `290cc4d`..`9f131b1`.

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

Still open before the first submit:

- Distribution is United States only and the app is free. Ignore the EU Digital
  Services Act trader-status banner in App Store Connect; it only matters for EU
  availability.
- Signing and push key: `eas build -p ios -e production` creates them via Apple
  login, or `eas credentials`. Nothing from the old Trendi team is reusable.
- Android: `google-service-account.json` (Play Console service account) in the
  repo root, ignored by git. First Play upload must be done by hand.
- Push on Android: `google-services.json` from the Firebase console in the repo
  root (or `GOOGLE_SERVICES_JSON` pointing at an EAS file secret), and the FCM V1
  key uploaded with `eas credentials`.

```bash
eas build -p ios -e production && eas submit -p ios -e production
eas build -p android -e production && eas submit -p android -e production
```
