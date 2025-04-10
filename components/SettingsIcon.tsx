import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {useRouter} from "expo-router";

export const SettingsIcon = () => {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push('/settings')}>
                <Ionicons name="settings-outline" size={30} color="#fff"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        margin: 16,
    },
});