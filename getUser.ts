import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig";
import {User} from "@/models";


const getUser = async (): Promise<User | undefined> => {
    const uid = auth.currentUser?.uid
    if (!uid) {
        return undefined;
    }
    const docRef = doc(db, "users", uid);
    const result = await getDoc(docRef);
    if (!result.exists()) {
        return undefined;
    } else {
        return result.data() as User;
    }
};

export default getUser;