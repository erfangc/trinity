import {Timestamp} from "firebase/firestore";

export interface PrayerIntention {
    id: string;
    userId: string;
    from: string;
    creationDate: Date;
    description: string;
    answered: boolean;
    answeredByFirstName?: string;
    answerByUserId?: string;
    answererParish?: string;
    answeredTime?: Date;
    read?: boolean;
}


export interface User {
    /**
     * Timestamp when the user document was created.
     * Stored as a Firestore `Timestamp`.
     */
    createdAt: Timestamp;

    /**
     * User's first name
     */
    firstName: string;

    /**
     * User's last name
     */
    lastName: string;

    /**
     * The parish to which the user belongs
     */
    parish: string;

    /**
     * The user’s chosen username or email address
     */
    username: string;

    name?: string;
}