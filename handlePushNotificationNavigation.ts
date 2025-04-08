import {router} from "expo-router";
import * as Notifications from "expo-notifications";

export function handlePushNotificationNavigation(data: any | undefined) {
    if (data && data.prayerIntentionId) {
        router.navigate(`/prayer-intentions/${data.prayerIntentionId}`);
    }
    Notifications.clearLastNotificationResponseAsync();
}