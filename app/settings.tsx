import React, {useEffect, useRef, useState} from "react";
import {Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";
import {supabase} from "@/supabase";
import {useUser} from "@/hooks/useUser";
import { Modalize } from "react-native-modalize";

export default function Inbox() {

    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const user = useUser();

    const bottomSheetRef = useRef<Modalize>(null); // Reference to Modalize (Bottom Sheet)

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

    const renderModalizeContent = () => (
        <View style={styles.bottomSheetContainer}>
            <Text style={styles.bottomSheetTitle}>Update Information</Text>
            <TextInput
                style={styles.inputField}
                placeholder="Enter new value"
                value={''}
                onChangeText={() => null}
                placeholderTextColor="#888"
            />
            <TouchableOpacity
                style={styles.bottomSheetButton}
                onPress={() => Alert.alert("Success", "Button Pressed!")}
            >
                <Text style={{ color: "white", textAlign: "center" }}>Save</Text>
            </TouchableOpacity>
        </View>
    );

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

            {/* Open Bottom Sheet Button */}
            <TouchableOpacity
                style={styles.deactivateButton}
                onPress={() => bottomSheetRef.current?.open()}
            >
                <Text style={{ color: "white", textAlign: "center" }}>Open Bottom Sheet</Text>
            </TouchableOpacity>

            {/* Bottom Sheet */}
            <Modalize
                ref={bottomSheetRef}
                snapPoint={300} // Height of the Bottom Sheet
                modalStyle={{ backgroundColor: "#333" }}
            >
                {renderModalizeContent()}
            </Modalize>
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
    bottomSheetContainer: {
        padding: 16,
        backgroundColor: "#333",
        flex: 1,
    },
    bottomSheetTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    inputField: {
        backgroundColor: "#444",
        borderRadius: 8,
        padding: 12,
        color: "white",
        marginBottom: 16,
    },
    bottomSheetButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: "#3248e3",
        borderRadius: 8,
    },
});
