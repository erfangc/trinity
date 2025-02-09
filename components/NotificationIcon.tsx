import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {collection, getCountFromServer, query, where} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig";

export const NotificationIcon = () => {

    const [count, setCount] = useState(0);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            return;
        }
        const q = query(collection(db, "prayerIntentions"), where("userId", "==", currentUser.uid));
        getCountFromServer(q).then(value => setCount(value.data().count));
    }, [currentUser]);

    return (
        <View style={{flexDirection: "row", justifyContent: "flex-end", margin: 16}}>
            {/* Notification Icon */}
            <TouchableOpacity onPress={() => null}>
                <Ionicons name="notifications-outline" size={30} color="#fff"/>
                {
                    count > 0 ?
                        <View style={notificationIconStyles.notificationBadge}>
                            <Text style={notificationIconStyles.notificationText}>!</Text>
                        </View>
                        : null
                }
            </TouchableOpacity>
        </View>
    );
}

const notificationIconStyles = StyleSheet.create({
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