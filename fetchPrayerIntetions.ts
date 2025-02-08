import {collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where} from "firebase/firestore";
import {db} from "./firebaseConfig"; // Your Firebase setup file

export const fetchPrayIntentions = async (N: number): Promise<PrayIntention[]> => {

    try {
        const q = query(
            collection(db, "prayerIntentions"),
            where("answered", "==", false),
            orderBy("creationDate", "asc"),
            limit(N)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            creationDate: doc.data().creationDate.toDate(),
        } as PrayIntention));
    } catch (error) {
        console.error("Error fetching prayer intentions:", error);
        return [];
    }
};

export const fetchPrayIntentionById = async (id: string): Promise<PrayIntention | null> => {
    try {
        const docRef = doc(db, "prayerIntentions", id); // Reference to the document by ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                creationDate: docSnap.data().creationDate.toDate(), // Convert Firestore Timestamp to Date
            } as PrayIntention;
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
        const docRef = doc(db, "prayerIntentions", id); // Reference to the document by ID
        await updateDoc(docRef, { answered: true }); // Update the `answered` field to true
        console.log(`Prayer intention with ID: ${id} marked as answered.`);
        return true;
    } catch (error) {
        console.error(`Error updating prayer intention with ID: ${id}`, error);
        return false;
    }
};