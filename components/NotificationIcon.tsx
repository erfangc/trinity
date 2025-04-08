import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {useRouter} from "expo-router";

export const NotificationIcon = () => {

    const [count, setCount] = useState(0);
    const router = useRouter();

    // TODO figure out if there is a notification

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push('/inbox')}>
                <Ionicons name="notifications-outline" size={30} color="#fff"/>
                {
                    count > 0 ?
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>!</Text>
                        </View>
                        : null
                }
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
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#7E4D26',
        borderRadius: 10,
        padding: 4,
    },
    notificationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});