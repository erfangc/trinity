import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CtaButton from "@/components/ui/CtaButton";
import {useRouter} from "expo-router";
import {signOut} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {fetchPrayIntentions} from "@/fetchPrayerIntetions";
import {auth} from "@/firebaseConfig";
import {PrayerRequestCard} from "@/components/PrayerRequestCard";
import {NotificationIcon} from "@/components/NotificationIcon"; // Expo supports this out of the box

export default function LandingScreen() {

    const [prayerIntentions, setPrayerIntentions] = useState<PrayerIntention[]>([]);
    const router = useRouter();

    useEffect(() => {
        return fetchPrayIntentions(7, prayerIntentions => setPrayerIntentions(prayerIntentions));
    }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => router.push('/'))
            .catch(err => console.log(err));
    };

    const navigateToPrayerIntention = (prayerIntention: PrayerIntention) => {
        router.push(`/prayer-intentions/${prayerIntention.id}`);
    };

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={{flex: 1, justifyContent: 'flex-start', gap: 16, width: '100%'}}>
                <NotificationIcon />

                {prayerIntentions.map(prayerIntention => (
                    <PrayerRequestCard
                        key={prayerIntention.id}
                        name={prayerIntention.from}
                        onPress={() => navigateToPrayerIntention(prayerIntention)}
                    />
                ))}
                {
                    prayerIntentions.length === 0
                        ?
                        <View style={{opacity: 0.9, backgroundColor: '#7E4D26', marginHorizontal: 12, padding: 24, borderRadius: 8}}>
                            <Text style={{color: '#fff'}}>
                                There are currently no prayer intentions available. Please check back later!
                            </Text>
                        </View>
                        : null
                }
            </SafeAreaView>
            <View style={{marginBottom: 24}}>
                <CtaButton title={"REQUEST A PRAYER"} onPress={() => router.push('/create-prayer-intention')}/>
                <TouchableOpacity style={styles.signOutContainer}
                                  onPress={() => router.push('/create-prayer-intention')}>
                    <Text style={styles.signOutText} onPress={handleSignOut}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    signOutContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    signOutText: {
        color: "#fff",
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
