import React, {useEffect, useState} from "react";
import {Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import CtaButton from "@/components/CtaButton";
import {useLocalSearchParams, useRouter} from "expo-router";
import {PrayerIntentionDenormalized} from "@/generated-sdk";
import {api} from "@/sdk";
import {useUser} from "@/context/UserContext";

const PrayerDetailScreen = () => {

    const router = useRouter();
    const {id} = useLocalSearchParams();
    const [prayerIntention, setPrayerIntention] = useState<PrayerIntentionDenormalized>();
    const user = useUser();

    useEffect(() => {
        if (id) {
            api
                .getPrayerIntention(parseInt(id as string))
                .then(resp => setPrayerIntention(resp.data));
        }
    }, [id]);

    const handleAnswerPrayerIntention = async () => {
        await api
            .answerPrayer(parseInt(id as string));
        Alert.alert("Success", "Thank you for praying this intention.");
        router.navigate('/landing');
    };

    const answererName = prayerIntention?.answerer?.firstName ?? 'a devoted parishioner';
    const answererChurch = prayerIntention?.answerer?.church?.name ?? 'our Christian community';
    const answeredAt = prayerIntention?.answeredAt ? new Date(prayerIntention?.answeredAt).toLocaleString() : undefined;

    console.log(prayerIntention);

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>

            {/* Prayer Content */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.prayerBox}>
                    <Text style={styles.prayerText}>
                        “{prayerIntention?.intentionText}”
                    </Text>
                </View>

                {/* Response Box */}
                {
                    prayerIntention?.answererId
                        ?
                        <View style={styles.responseBox}>
                            <Text style={styles.responseText}>
                                “{answererName?.trim()}, a devoted parishioner from {answererChurch}, lifted
                                you up in prayer.”
                            </Text>
                            {answeredAt && <Text style={styles.timestamp}>{answeredAt}</Text>}
                        </View>
                        :
                        user?.id === prayerIntention?.creatorId
                            ?
                            <View style={styles.responseBox}>
                                <Text style={styles.responseText}>
                                    If someone prays for you, you will be notified here.
                                </Text>
                            </View>
                            : null
                }

                {/* Primary CTA Button */}
                {
                    prayerIntention?.answerer !== undefined
                        ?
                        <View style={styles.buttonContainer}>
                            <CtaButton
                                title={`Pray for ${prayerIntention?.creator?.firstName}`}
                                onPress={handleAnswerPrayerIntention}
                            />
                        </View>
                        : null
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12100D", // Dark theme background
        padding: 20,
    },
    backButton: {
        position: "absolute",
        zIndex: 1,
        top: 64,
        left: 20,
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60, // Adjust for back button spacing
        paddingHorizontal: 12,
    },
    prayerBox: {
        backgroundColor: "#C5B89D", // Light beige color
        padding: 15,
        borderRadius: 10,
        width: "100%",
    },
    prayerText: {
        fontSize: 16,
        color: "#000", // Dark text
        lineHeight: 24,
    },
    responseBox: {
        backgroundColor: "#7E7E7E", // Gray color for response
        padding: 15,
        borderRadius: 10,
        width: "100%",
        marginTop: 20,
    },
    responseText: {
        fontSize: 16,
        color: "#fff",
        lineHeight: 24,
    },
    timestamp: {
        fontSize: 12,
        color: "#fff", // Lighter text color
        textAlign: "right",
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    primaryButton: {
        backgroundColor: "#7E4D26", // Brown color
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: "100%",
        alignItems: "center",
    },
});

export default PrayerDetailScreen;