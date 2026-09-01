// EAS Metadata store configuration (eas metadata:push / metadata:pull).
// Docs: https://docs.expo.dev/eas/metadata/config/
//
// This is a JS file rather than store.config.json so the App Store version it
// writes to always matches the version literal in app.config.ts: the build that
// eas submit uploads carries that version, and App Store Connect can only
// attach it to a version record with the same number.
//
// Screenshots come from `npm run capture:ios`; everything else is plain text.
// Age rating answers live under `advisory`. Review contact details and the demo
// account are intentionally not here: fill them in App Store Connect under
// App Review, or add an `apple.review` block if you want them in git.

/* global __dirname */
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const appConfig = readFileSync(join(__dirname, 'app.config.ts'), 'utf8');
const version = appConfig.match(/version: "(\d+\.\d+\.\d+)"/)?.[1];
if (!version) throw new Error('store.config.js: could not find version literal in app.config.ts');

const config = {
  configVersion: 0,
  apple: {
    copyright: "2026 Trinity Prayer Inc",
    categories: [
      "LIFESTYLE"
    ],
    info: {
      "en-US": {
        title: "Pray Trinity",
        subtitle: "Parish prayer intentions",
        promoText: "Share a prayer intention with your parish and be told the moment someone prays for it.",
        description: "Pray Trinity brings the prayer life of your parish into your pocket.\n\nAsk for prayer. Write down what is weighing on your heart and share it with the members of your church in a few taps. Your intention reaches people who have promised to pray for one another.\n\nPray for others. Open the app to see the intentions your fellow parishioners have shared. When you pray for one, mark it, and the person who asked receives a gentle notification that they have been prayed for.\n\nStay connected. Your inbox keeps every intention you have shared so you can look back at what has been lifted up on your behalf.\n\nSet the mood. Turn on the built-in Gregorian chant while you pray.\n\nPray Trinity is free, has no ads, and is made for Catholic parishes in the United States. Choose your church when you sign up and start praying with your community today.",
        keywords: [
          "prayer",
          "intentions",
          "parish",
          "catholic",
          "church",
          "pray",
          "faith",
          "community",
          "intercession",
          "rosary"
        ],
        releaseNotes: "Pray Trinity is new on the App Store. Share prayer intentions with your parish and be notified when someone prays for you.",
        supportUrl: "https://trinityprayer.org",
        marketingUrl: "https://trinityprayer.org",
        privacyPolicyUrl: "https://trinityprayer.org/privacy.html",
        screenshots: {
          APP_IPHONE_67: [
            "./store-assets/ios/iphone-6.9-01-welcome.png",
            "./store-assets/ios/iphone-6.9-02-landing.png",
            "./store-assets/ios/iphone-6.9-03-request-a-prayer.png",
            "./store-assets/ios/iphone-6.9-04-sign-up.png"
          ]
        }
      }
    },
    advisory: {
      alcoholTobaccoOrDrugUseOrReferences: "NONE",
      contests: "NONE",
      gamblingSimulated: "NONE",
      horrorOrFearThemes: "NONE",
      matureOrSuggestiveThemes: "NONE",
      medicalOrTreatmentInformation: "NONE",
      profanityOrCrudeHumor: "NONE",
      sexualContentGraphicAndNudity: "NONE",
      sexualContentOrNudity: "NONE",
      violenceCartoonOrFantasy: "NONE",
      violenceRealistic: "NONE",
      violenceRealisticProlongedGraphicOrSadistic: "NONE",
      gunsOrOtherWeapons: "NONE",
      gambling: false,
      lootBox: false,
      advertising: false,
      unrestrictedWebAccess: false,
      messagingAndChat: false,
      userGeneratedContent: true,
      healthOrWellnessTopics: false,
      parentalControls: false,
      kidsAgeBand: null,
    ageRatingOverride: "NONE",
    koreaAgeRatingOverride: "NONE"
    },
    release: {
      automaticRelease: true,
      phasedRelease: false
    }
  }
};
config.apple.version = version;

module.exports = config;
