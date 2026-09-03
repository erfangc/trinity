import React, {useEffect, useState} from "react";
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";
import {supabase} from "@/supabase";
import {useUser} from "@/hooks/useUser";
import ChurchSelector from "@/components/ChurchSelector";
import {accountApi} from "@/sdk";

export default function Settings() {

    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [churchId, setChurchId] = useState<number>();
    const user = useUser();

    useEffect(() => {
        if (user) {
            setFirstName(user.user_metadata?.first_name || "");
            setLastName(user.user_metadata?.last_name || "");
            setChurchId(user.user_metadata?.church_id || undefined);
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) {
            Alert.alert("Error", "User is not logged in");
            return;
        }

        const payload: any = {
            first_name: firstName,
            last_name: lastName,
        };

        if (churchId) {
            payload['church_id'] = churchId;
        }

        const {error} = await supabase.auth.updateUser({data: payload});

        if (error) {
            console.error("Error updating user metadata:", error.message);
            Alert.alert("Error", error.message);
            return;
        }

        Alert.alert("Saved", "Your profile has been updated.");
    };

    const [deleting, setDeleting] = useState(false);

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete your account?",
            "This permanently deletes your account, your profile, and every prayer intention you submitted. This cannot be undone.",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Delete Account",
                    style: "destructive",
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            await accountApi.deleteMyAccount();
                        } catch (error) {
                            console.error("Error deleting account:", error);
                            setDeleting(false);
                            Alert.alert("Error", "We could not delete your account. Please try again or email support@trinityprayer.org.");
                            return;
                        }
                        await supabase.auth.signOut({scope: "local"});
                        setDeleting(false);
                        Alert.alert("Account deleted", "Your account and prayer intentions have been removed.");
                        router.replace("/");
                    },
                },
            ],
        );
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
                <ChurchSelector churchId={churchId} onChange={(churchId) => setChurchId(churchId)}/>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} disabled={deleting}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                    {deleting ? "Deleting…" : "Delete Account"}
                </Text>
            </TouchableOpacity>
            <Text style={styles.deleteHint}>
                Deleting your account removes your profile and all prayer intentions you submitted. This cannot be undone.
            </Text>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 16,
    },
    deleteButton: {
        marginTop: 40,
        marginHorizontal: 16,
        padding: 12,
        backgroundColor: "#D9534F",
        borderRadius: 8,
    },
    deleteHint: {
        color: "#B3B3B3",
        fontSize: 12,
        marginTop: 8,
        marginHorizontal: 16,
    },
    saveButton: {
        marginTop: 20,
        marginHorizontal: 16,
        padding: 12,
        backgroundColor: "#7E4D26",
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
