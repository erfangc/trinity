import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MaterialIcons} from "@expo/vector-icons";
import {PrayerIntentionDenormalized} from "@/generated-sdk";

export const PrayerRequestCard: React.FC<{ prayerIntention: PrayerIntentionDenormalized, onPress: () => void }> = ({prayerIntention, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{marginHorizontal: 12}}>
            <View style={styles.overlay}>
                <Text style={styles.text}>{prayerIntention?.creator?.firstName} requested prayer intention</Text>
                <MaterialIcons name="chevron-right" size={24} color="#FFD700" style={styles.icon}/>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginRight: 10,
    },
    overlay: {
        minWidth: '80%',
        padding: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#7E4D26",
        opacity: 0.95,
        borderRadius: 10,
    },
    text: {
        color: "#B1AA91",
        fontSize: 14,
        fontWeight: "500",
    },
})