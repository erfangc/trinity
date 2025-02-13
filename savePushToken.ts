// Saves the push token to Firestore under the currently authenticated user.
import {auth, db} from "@/firebaseConfig";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";

export async function savePushToken(token: string) {
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