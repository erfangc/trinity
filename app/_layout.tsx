import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {useEffect, useRef} from 'react';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import {useColorScheme} from '@/hooks/useColorScheme';
import {GregorianChantContextProvider} from "@/context/GregorianChantContext";
import {UserContextProvider} from '@/context/UserContextProvider';
import '@/environment';
import {supabase} from "@/supabase";
import {handlePushNotificationNavigation} from "@/handlePushNotificationNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import the wrapper

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

    const responseListener = useRef<any>();

    useEffect(() => {
        // Listener for when a user interacts with a notification.
        responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
            const {data} = await supabase.auth.getSession();
            if (data && data.session) {
                handlePushNotificationNavigation(response.notification.request.content.data);
                await Notifications.clearLastNotificationResponseAsync();
            }
        });

        return () => {
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

        <GregorianChantContextProvider>
            <GestureHandlerRootView style={{flex: 1}}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <StatusBar barStyle="light-content"/>
                    <UserContextProvider>
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
                    </UserContextProvider>
                </ThemeProvider>
            </GestureHandlerRootView>
        </GregorianChantContextProvider>
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