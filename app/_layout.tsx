import {DarkTheme, DefaultTheme, Stack, ThemeProvider} from 'expo-router';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {useEffect, useRef} from 'react';
import * as Notifications from 'expo-notifications';
import {useColorScheme} from '@/hooks/useColorScheme';
import {GregorianChantContextProvider} from "@/context/GregorianChantContext";
import {UserContextProvider} from '@/context/UserContextProvider';
import '@/environment';
import {supabase} from "@/supabase";
import {handlePushNotificationNavigation} from "@/handlePushNotificationNavigation";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
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

    const responseListener = useRef<Notifications.EventSubscription | null>(null);

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
            responseListener.current?.remove();
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
            {/*<GestureHandlerRootView style={{flex: 1}}>*/}
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
                            <Stack.Screen name="prayer-intentions/[id]"/>
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                    </UserContextProvider>
                </ThemeProvider>
            {/*</GestureHandlerRootView>*/}
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