import {ConfigContext, ExpoConfig} from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: "Trinity Prayers",
        slug: "trinity",
        version: "1.0.1",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "trinity",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
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
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
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
            SUPABASE_URL: process.env.SUPABASE_URL,
            TRINITY_API_URL: process.env.TRINITY_API_URL,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        },
        owner: "erfangc",
    };
};