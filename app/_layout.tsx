import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ActivityIndicator, Alert, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import 'react-native-reanimated';
import {onAuthStateChanged} from "@firebase/auth";
import * as Notifications from 'expo-notifications';
import {useColorScheme} from '@/hooks/useColorScheme';
import {auth, db} from "@/firebaseConfig";
import * as Device from 'expo-device';
import {arrayUnion, doc, updateDoc} from "firebase/firestore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function RootLayout() {

    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("User is signed in:", user);
                router.push('/landing');
            }
        });
        return () => unsubscribe();
    }, []);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
        // Register for push notifications and get the token.
        registerForPushNotificationsAsync().then((token) => {
            if (token) {
                setExpoPushToken(token);
                // Send the token to Firestore for the currently authenticated user.
                savePushToken(token);
            }
        });

        // Listener for notifications received while the app is foregrounded.
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        // Listener for when a user interacts with a notification.
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('User interacted with notification:', response);
        });

        return () => {
            if (notificationListener.current)
                Notifications.removeNotificationSubscription(notificationListener.current);
            if (responseListener.current)
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    if (!loaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF"/>
            </View>
        );
    }


    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar barStyle="light-content"/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="landing"/>
                <Stack.Screen name="sign-up"/>
                <Stack.Screen name="sign-in"/>
                <Stack.Screen name="inbox"/>
                <Stack.Screen name="create-prayer-intention"/>
                <Stack.Screen name="prayer-intentions/:id"/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </ThemeProvider>
    );
}


// Registers for push notifications and returns the Expo push token.
async function registerForPushNotificationsAsync() {
    let token;
    // Note: On simulators, push notifications may not be supported.
    if (!Device.isDevice) {
        Alert.alert('Push notifications are not supported on simulators.');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notifications!');
        return;
    }
    try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo push token:', token);
    } catch (error) {
        console.error('Error getting Expo push token:', error);
    }

    // Android-specific configuration.
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

// Saves the push token to Firestore under the currently authenticated user.
async function savePushToken(token: string) {
    const user = auth.currentUser;
    if (!user) {
        console.log("User not logged in, can't save push token.");
        return;
    }
    try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            expoPushTokens: arrayUnion(token),
        });
        console.log("Push token saved to Firestore.");
    } catch (error) {
        console.error("Error saving push token to Firestore:", error);
    }
}

// Styles
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#12100D',
    },
});