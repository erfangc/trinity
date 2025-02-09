interface Credentials {
    username: string;
    password: string;
}

interface PrayerIntention {
    id: string;
    from: string;
    creationDate: Date;
    description: string;
    answered: boolean;
}