import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CtaButton from "@/components/CtaButton";
import {useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {PrayerRequestCard} from "@/components/PrayerRequestCard";
import {NotificationIcon} from "@/components/NotificationIcon";
import {SettingsIcon} from "@/components/SettingsIcon";
import {PlayPauseIcon} from "@/components/PlayPauseIcon";
import {supabase} from "@/supabase";
import {PrayerIntentionDenormalized} from "@/generated-sdk";
import * as Notifications from 'expo-notifications';
import {api} from "@/sdk";
import {useUser} from "@/hooks/useUser";
import {handlePushNotificationNavigation} from "@/handlePushNotificationNavigation";

/**
 * A functional component that represents the main landing screen of the application.
 * It displays a list of prayer intentions, allows users to navigate to details of a selected prayer intention,
 * make a new prayer request, or sign out of the application.
 *
 * @return {JSX.Element} The rendered LandingScreen component.
 */
export default function LandingScreen() {

    const [prayerIntentions, setPrayerIntentions] = useState<PrayerIntentionDenormalized[]>([]);
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (user && !user.is_anonymous) {
            api.getPrayerIntentions().then(resp => setPrayerIntentions(resp.data));
        }
    }, [user]);

    const handleSignOut = () => {
        supabase.auth.signOut().then(() => router.push('/'));
    };

    useEffect(() => {
        Notifications
            .getLastNotificationResponseAsync()
            .then(response => {
                const data = response?.notification?.request?.content?.data;
                handlePushNotificationNavigation(data);
            });
    }, []);

    const navigateToPrayerIntention = (prayerIntention: PrayerIntentionDenormalized) => {
        router.push(`/prayer-intentions/${prayerIntention.id}`);
    };

    const emptyStateMessage = user?.is_anonymous
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
                        prayerIntention={prayerIntention}
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
