interface Credentials {
    username: string;
    password: string;
}

interface PrayIntention {
    id: string;
    from: string;
    creationDate: Date;
    description: string;
    answered: boolean;
}