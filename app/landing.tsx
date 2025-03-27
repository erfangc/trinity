import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CtaButton from "@/components/CtaButton";
import {useRouter} from "expo-router";
import {signOut} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {fetchPrayIntentions} from "@/fetchPrayerIntetions";
import {auth} from "@/firebaseConfig";
import {PrayerRequestCard} from "@/components/PrayerRequestCard";
import {NotificationIcon} from "@/components/NotificationIcon";
import {PrayerIntention} from "@/models";
import {SettingsIcon} from "@/components/SettingsIcon";
import {PlayPauseIcon} from "@/components/PlayPauseIcon"; // Expo supports this out of the box

/**
 * A functional component that represents the main landing screen of the application.
 * It displays a list of prayer intentions, allows users to navigate to details of a selected prayer intention,
 * make a new prayer request, or sign out of the application.
 *
 * @return {JSX.Element} The rendered LandingScreen component.
 */
export default function LandingScreen() {

    const [prayerIntentions, setPrayerIntentions] = useState<PrayerIntention[]>([]);
    const router = useRouter();

    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser && !currentUser.isAnonymous) {
            return fetchPrayIntentions(7, prayerIntentions => setPrayerIntentions(prayerIntentions));
        }
    }, [currentUser]);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => router.push('/'))
            .catch(err => console.log(err));
    };

    const navigateToPrayerIntention = (prayerIntention: PrayerIntention) => {
        router.push(`/prayer-intentions/${prayerIntention.id}`);
    };

    const emptyStateMessage = currentUser?.isAnonymous
        ? "Other people's prayer intentions will appear here. You can only pray for them if you sign up."
        : "There are currently no prayer intentions available. Please check back later!";

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={{flex: 1, justifyContent: 'flex-start', gap: 16, width: '100%'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <SettingsIcon/>
                        <PlayPauseIcon/>
                    </View>
                    <NotificationIcon/>
                </View>

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
                        <View style={{
                            opacity: 0.9,
                            backgroundColor: '#7E4D26',
                            marginHorizontal: 12,
                            padding: 24,
                            borderRadius: 8,
                        }}>
                            <Text style={{color: '#fff'}}>
                                {emptyStateMessage}
                            </Text>
                        </View>
                        : null
                }
            </SafeAreaView>
            <View style={{marginBottom: 24}}>
                <CtaButton title={"REQUEST A PRAYER"} onPress={() => router.push('/create-prayer-intention')}/>
                <TouchableOpacity
                    style={styles.signOutContainer}
                    onPress={() => router.push('/create-prayer-intention')}
                >
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
