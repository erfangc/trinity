import {collection, addDoc, Timestamp} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig"; // Your Firebase setup file

export const addPrayIntention = async (prayerIntention: { description: string, from: string }) => {
    try {
        await addDoc(collection(db, "prayerIntentions"), {
            description: prayerIntention.description,
            from: prayerIntention.from,
            userId: auth.currentUser?.uid,
            answered: false,
            creationDate: Timestamp.now(),
        });
        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};