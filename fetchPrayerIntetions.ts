import {
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    Unsubscribe,
    updateDoc,
    where
} from "firebase/firestore";
import {auth, db} from "./firebaseConfig";

export const fetchPrayIntentions = (N: number, onData: (prayerIntentions: PrayerIntention[]) => void): Unsubscribe => {

    const q = query(
        collection(db, "prayerIntentions"),
        where("answered", "==", false),
        orderBy("creationDate", "asc"),
        limit(N)
    );

    return onSnapshot(q, {
        next: snapshot => {
            const prayerIntentions = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    creationDate: doc.data().creationDate.toDate(),
                } as PrayerIntention;
            });
            onData(prayerIntentions);
        },
        error: error => {
            console.error("Error fetching prayer intentions:", error);
        }
    });
};

export const fetchPrayIntentionById = async (id: string): Promise<PrayerIntention | null> => {
    try {
        const docRef = doc(db, "prayerIntentions", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                creationDate: docSnap.data().creationDate.toDate(),
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
        const answererParish = getParish();

        /*
        Update the prayerIntention by setting answer to true and adding who answered the prayer
         */
        await updateDoc(docRef, {
            answered: true,
            answeredByFirstName: currentUser.displayName ?? 'A faithful servant of God',
            answeredByUserId: currentUser.uid,
            answererParish: answererParish,
        });

        console.log(`Prayer intention with ID: ${id} marked as answered.`);
        return true;
    } catch (error) {
        console.error(`Error updating prayer intention with ID: ${id}`, error);
        return false;
    }
};

async function getParish(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return null;
    }

    const userDocRef = doc(db, "users", currentUser.uid); // Fetch user's document using their UID
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.parish;
    } else {
        return null;
    }

}