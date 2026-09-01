import {ConfigContext, ExpoConfig} from "expo/config";
import {existsSync} from "node:fs";

const BUNDLE_ID = "net.trinity.prayers.app";

// Firebase Android config for push notifications (FCM). Download from the Firebase
// console, keep it out of git, or point GOOGLE_SERVICES_JSON at an EAS file secret.
const googleServicesFile = process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json";

export default ({config}: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Pray Trinity",
    slug: "trinity",
    owner: "erfangc",
    version: "1.1.2",
    description: "Share prayer intentions with your parish and be notified when they are prayed for.",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "trinity",
    primaryColor: "#12100D",
    userInterfaceStyle: "automatic",
    platforms: ["ios", "android"],
    ios: {
        bundleIdentifier: BUNDLE_ID,
        supportsTablet: false,
        // ITSAppUsesNonExemptEncryption=false; skips the export-compliance prompt on every TestFlight upload.
        config: {usesNonExemptEncryption: false},
        infoPlist: {
            UIBackgroundModes: ["remote-notification"],
        },
    },
    android: {
        package: BUNDLE_ID,
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        permissions: ["android.permission.POST_NOTIFICATIONS"],
        blockedPermissions: [
            "android.permission.RECORD_AUDIO",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
        ],
        ...(existsSync(googleServicesFile) ? {googleServicesFile} : {}),
    },
    web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/background.png",
                resizeMode: "contain",
                backgroundColor: "#000000",
            },
        ],
        [
            "expo-notifications",
            {
                color: "#12100D",
                defaultChannel: "default",
            },
        ],
        [
            "expo-audio",
            {
                microphonePermission: false,
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: "e5ba8825-1c82-4044-b3c2-8d365424a935",
        },
    },
});
