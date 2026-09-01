# Pray Trinity

Expo / React Native app for sharing parish prayer intentions. See `CLAUDE.md`
for the architecture rules, accounts, and the full release pipeline.

## Develop

```bash
npm install
npm run ios                 # build + install the dev client on a simulator (needs Xcode)
npx expo start              # Metro; the dev client connects to it
npm run typecheck && npm run lint && npm run doctor
```

## Release

1. Bump `version` in `app.config.ts`.
2. Merge to `main`. The Store Release workflow builds on EAS and submits to
   App Store Connect (and Play, once `RELEASE_PLATFORM=all`).
3. When the build finishes processing, open the version in App Store Connect
   and press **Add for Review**.

Manual equivalent:

```bash
eas build -p ios -e production --auto-submit
npm run metadata:push       # listing text, screenshots, age rating from store.config.js
```

## Store images

```bash
npx expo start --port 8083  # in another terminal
npm run capture:ios         # store-assets/ios/*.png from the iPhone 17 Pro Max simulator
npm run store-assets        # icons, Play feature graphic and phone screenshots
```
