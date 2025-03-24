import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View, SafeAreaView, StyleSheet, Alert} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {deleteDoc, doc} from "firebase/firestore";
import {deleteUser} from "firebase/auth";
import {auth, db} from "@/firebaseConfig";

export default function Inbox() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);


    useEffect(() => {
        const currentUser = auth.currentUser;
        // Set the user's data if they are logged in
        if (currentUser) {
            setUserData({
                email: currentUser.email,
                uid: currentUser.uid,
                displayName: currentUser.displayName || "No display name",
            });
        }
    }, []);


    const handleDeactivateAccount = async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            Alert.alert("Error", "No user is currently signed in.");
            return;
        }


        if (currentUser.isAnonymous) {
            Alert.alert("Error", "Anonymous users cannot deactivate their account.");
            return;
        }

        try {
            // Delete the user's Firestore document
            await deleteDoc(doc(db, "users", currentUser.uid));

            // Delete the user account
            await deleteUser(currentUser);

            Alert.alert("Success", "Your account has been deactivated.");
            router.replace("/sign-in");
        } catch (error) {
            Alert.alert("Error", "There was an issue deactivating your account: " + (error instanceof Error ? error.message : "unknown error"));
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#221F1F"}}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>

            <View style={{marginLeft: 16}}>
                <Text style={{color: '#fff', fontSize: 24, marginTop: 12, fontWeight: 'bold'}}>Settings</Text>
            </View>

            {/* Display User Data */}
            {userData && (
                <View style={styles.userInfo}>
                    <Text style={styles.userInfoText}><Text
                        style={styles.label}>Email: </Text>{userData.email || "No email"}</Text>
                    <Text style={styles.userInfoText}><Text style={styles.label}>UID: </Text>{userData.uid}</Text>
                    <Text style={styles.userInfoText}><Text style={styles.label}>Display
                        Name: </Text>{userData.displayName}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivateAccount}>
                <Text style={{color: 'white', textAlign: 'center'}}>Deactivate Account</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 16,
    },
    deactivateButton: {
        marginTop: 20,
        marginLeft: 16,
        padding: 12,
        backgroundColor: "#D9534F",
        borderRadius: 8,
    },
    userInfo: {
        margin: 16,
        padding: 12,
        backgroundColor: "#333",
        borderRadius: 8,
    },
    userInfoText: {
        color: "white",
        fontSize: 16,
        marginBottom: 4,
    },
    label: {
        fontWeight: "bold",
    },
});
