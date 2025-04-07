import React, {useEffect, useState} from "react";
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";
import {supabase} from "@/supabase";
import {useUser} from "@/hooks/useUser";

export default function Inbox() {

    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const user = useUser();

    useEffect(() => {
        if (user) {
            setFirstName(user.user_metadata?.first_name || "");
            setLastName(user.user_metadata?.last_name || "");
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) {
            Alert.alert("Error", "User is not logged in");
            return;
        }

        const { data, error } = await supabase
            .auth
            .updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            });

        if (error) {
            console.error("Error updating user metadata:", error.message);
            Alert.alert("Error", error.message);
            return;
        }

        Alert.alert("Success", "User metadata updated successfully");
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
            <View style={styles.userInfo}>
                <Text style={styles.userInfoText}><Text style={styles.label}>Email: </Text>{user?.email}</Text>
                <Text style={styles.userInfoText}><Text style={styles.label}>User ID: </Text>{user?.id}</Text>
                <View style={{marginTop: 16}}>
                    <TextInputField label={'First Name'} value={firstName} onChangeText={setFirstName}/>
                </View>
                <TextInputField label={'Last Name'} value={lastName} onChangeText={setLastName}/>
            </View>

            <TouchableOpacity style={styles.deactivateButton} onPress={() => null}>
                <Text style={{color: 'white', textAlign: 'center'}}>Deactivate Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
