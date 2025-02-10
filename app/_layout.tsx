import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {onAuthStateChanged} from "@firebase/auth";

import {useColorScheme} from '@/hooks/useColorScheme';
import {auth} from "@/firebaseConfig";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

// Styles
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#12100D',
    },
});