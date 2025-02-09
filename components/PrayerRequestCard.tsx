import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MaterialIcons} from "@expo/vector-icons";

export const PrayerRequestCard: React.FC<{ name: string, onPress: () => void }> = ({name = "John", onPress}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View
                style={styles.background1}
            >
                <View style={styles.overlay}/>
                <Text style={styles.text}>{name} requested A Prayer</Text>
                <MaterialIcons name="chevron-right" size={24} color="#FFD700" style={styles.icon}/>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    icon: {
        marginRight: 10,
    },
    card: {
        width: 330,
        height: 40,
        borderRadius: 10,
        overflow: "hidden",
    },
    background1: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#7E4D26",
        opacity: 0.9,
        borderRadius: 10,
    },
    text: {
        color: "#B1AA91",
        fontSize: 14,
        fontWeight: "500",
        textTransform: "uppercase",
        flex: 1,
    },
})