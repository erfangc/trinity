import {collection, addDoc, Timestamp} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig";
import {Alert} from "react-native"; // Your Firebase setup file

export const addPrayIntention = async (
    prayerIntention: { description: string, from: string }
) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        Alert.alert("You must be logged in to add a prayer intention");
        return;
    }
    try {
        await addDoc(collection(db, "prayerIntentions"), {
            description: prayerIntention.description,
            from: prayerIntention.from,
            userId: currentUser.uid,
            answered: false,
            read: false,
            creationDate: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};