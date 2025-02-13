// Registers for push notifications and returns the Expo push token.
import * as Device from "expo-device";
import {Alert, Platform} from "react-native";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
    let token;
    // Note: On simulators, push notifications may not be supported.
    if (!Device.isDevice) {
        Alert.alert('Push notifications are not supported on simulators.');
        return;
    }

    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
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