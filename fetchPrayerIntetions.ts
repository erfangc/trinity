import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "./firebaseConfig";
import {PrayerIntention} from "@/models";
import getUser from "@/getUser";

export const fetchPrayIntentionById = async (id: string): Promise<PrayerIntention | null> => {
    try {
        const docRef = doc(db, "prayerIntentions", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                creationDate: docSnap.data().creationDate.toDate(),
                answeredTime: docSnap.data().answeredTime?.toDate(),
            } as PrayerIntention;
        } else {
            console.warn(`No prayer intention found for ID: ${id}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching prayer intention by ID:", error);
        return null;
    }
};

export const markPrayerIntentionAsAnswered = async (id: string): Promise<boolean> => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return false;
        }

        // Reference to the document by ID
        const docRef = doc(db, "prayerIntentions", id);
        const user = await getUser();

        /*
        Update the prayerIntention by setting answer to true and adding who answered the prayer
         */
        await updateDoc(docRef, {
            answered: true,
            answeredByFirstName: user?.firstName ?? 'A faithful servant of God',
            answeredByUserId: currentUser.uid,
            answererParish: user?.parish,
            answeredTime: new Date(),
        });

        console.log(`Prayer intention with ID: ${id} marked as answered.`);
        return true;
    } catch (error) {
        console.error(`Error updating prayer intention with ID: ${id}`, error);
        return false;
    }
};
