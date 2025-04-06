import React from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";


export default function Inbox() {

    const router = useRouter();


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#221F1F"}}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>

            <View style={{marginLeft: 16}}>
                <Text style={{color: '#fff', fontSize: 24, marginTop: 12, fontWeight: 'bold'}}>Settings</Text>
            </View>

            {/* Display User Data */}
            <View style={styles.userInfo}>
                <Text style={styles.userInfoText}><Text style={styles.label}>Email: </Text>{"No email"}</Text>
                <Text style={styles.userInfoText}><Text style={styles.label}>User ID: </Text>{''}</Text>
                <View style={{marginTop: 16}}>
                    <TextInputField label={'First Name'} />
                </View>
                <TextInputField label={'Last Name'} />
            </View>

            <TouchableOpacity style={styles.deactivateButton} onPress={() => null}>
                <Text style={{color: 'white', textAlign: 'center'}}>Deactivate Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={() => null}>
                <Text style={{color: 'white', textAlign: 'center'}}>Handle Save</Text>
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
    saveButton: {
        marginTop: 20,
        marginLeft: 16,
        padding: 12,
        backgroundColor: "#3248e3",
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
        fontSize: 12
    },
});
