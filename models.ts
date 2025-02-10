interface PrayerIntention {
    id: string;
    userId: string;
    from: string;
    creationDate: Date;
    description: string;
    answered: boolean;
    answerByFirstName?: string;
    answerByUserId?: string;
    read?: boolean;
}