import {ConfigContext, ExpoConfig} from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: "Trinity Prayers",
        slug: "trinity",
        version: "1.1.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "trinity",
        userInterfaceStyle: "automatic",
        newArchEnabled: false,
        ios: {
            supportsTablet: false,
            bundleIdentifier: "org.trinity.prayers.app",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
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
                    backgroundColor: "#000",
                },
            ],
            "expo-secure-store",
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
        owner: "erfangc",
    };
};