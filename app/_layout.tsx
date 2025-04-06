import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import {useColorScheme} from '@/hooks/useColorScheme';
import {GregorianChantContextProvider} from "@/context/GregorianChantContext";
import {UserContextProvider} from '@/context/UserContext';
import '@/environment';

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

    const [, setNotification] = useState<Notifications.Notification | null>(null);
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
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
        <UserContextProvider>
            <GregorianChantContextProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <StatusBar barStyle="light-content"/>
                    <Stack screenOptions={{headerShown: false}}>
                        <Stack.Screen name="index"/>
                        <Stack.Screen name="landing"/>
                        <Stack.Screen name="sign-up"/>
                        <Stack.Screen name="sign-in"/>
                        <Stack.Screen name="inbox"/>
                        <Stack.Screen name="settings"/>
                        <Stack.Screen name="create-prayer-intention"/>
                        <Stack.Screen name="prayer-intentions/:id"/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                </ThemeProvider>
            </GregorianChantContextProvider>
        </UserContextProvider>
    );
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