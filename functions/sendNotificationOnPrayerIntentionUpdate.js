// sendNotificationOnPrayerIntentionUpdate.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');

// Initialize the Firebase Admin SDK only once
if (!admin.apps.length) {
    admin.initializeApp();
}

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Cloud Function: sendNotificationOnPrayerIntentionUpdate
 *
 * Trigger: Any update on a document in the "prayerIntentions" collection.
 *
 * This function performs the following:
 * 1. Checks for a valid `userId` on the updated document.
 * 2. Retrieves the corresponding user document from the "users" collection.
 *    It expects the user document to contain an array field `expoPushTokens`
 *    with valid Expo push tokens.
 * 3. Sends a push notification to all the Expo push tokens listed for that user.
 */
exports.sendNotificationOnPrayerIntentionUpdate = functions.firestore
    .onDocumentUpdated('prayerIntentions/{docId}', async (change, context) => {
        const afterData = change.data?.after?.data();
        const userId = afterData.userId;
        if (!userId) {
            console.log('No userId found in the updated document.');
            return null;
        }

        // Retrieve the user's document from Firestore
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            console.log(`User document not found for userId: ${userId}`);
            return null;
        }

        const userData = userDoc.data();
        const expoPushTokens = userData.expoPushTokens;
        if (!expoPushTokens || expoPushTokens.length === 0) {
            console.log(`No Expo push tokens found for userId: ${userId}`);
            return null;
        }

        // Build messages for each valid Expo push token.
        let messages = [];
        for (let pushToken of expoPushTokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            messages.push({
                to: pushToken,
                sound: 'default',
                title: 'Prayer Intention Updated',
                body: 'Your prayer intention has been updated.',
                data: { userId: userId, docId: context.params.docId },
            });
        }

        // Send notifications in chunks.
        let chunks = expo.chunkPushNotifications(messages);

        for (let chunk of chunks) {
            try {
                await expo.sendPushNotificationsAsync(chunk);
            } catch (error) {
                console.error('Error sending notifications:', error);
            }
        }

        // Optionally process tickets for error handling/reporting.
        return null;
    });