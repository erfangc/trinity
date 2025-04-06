import * as Device from "expo-device";
import {Alert, Platform} from "react-native";
import * as Notifications from "expo-notifications";

/**
 * Registers the device for push notifications and retrieves a push notification token.
 *
 * This method checks the device's permissions for receiving push notifications
 * and requests permission if not already granted. It retrieves an Expo push token
 * on success, handles platform-specific configurations, and logs/handles errors appropriately.
 * Note: Push notifications are not supported on simulators.
 *
 * @return {Promise<string|undefined>} A promise that resolves to the push notification token
 * if registration is successful, or `undefined` if registration fails or is not supported.
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
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