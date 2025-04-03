import React, {useEffect, useState} from "react";
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {supabase} from "@/supabase";
import {User} from "@supabase/auth-js";
import {Database} from "@/supabaseTypes";
import {TextInputField} from "@/components/TextInputField";

type AdditionalUserInfo = Database["public"]["Tables"]["additional_user_info"]["Row"];

export default function Inbox() {

    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [additionaluseIfo, setAdditionaluseIfo] = useState<AdditionalUserInfo>();

    useEffect(() => {
        supabase
            .auth
            .getSession()
            .then(({data, error}) => {
                if (error) {
                    console.error("Error getting session: ", error);
                    Alert.alert("Error", "There was an issue getting your session: " + error.message);
                } else {
                    setUser(data?.session?.user);
                }
            });
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchAdditionalUserInfo();
        }
    }, [user?.id]);

    const fetchAdditionalUserInfo = async () => {
        if (user === undefined) {
            return;
        }
        try {
            console.log(
                "Fetching additional user info for user ID: " + user.id
            )
            const { data, error } = await supabase
                .from("additional_user_info") // The table name
                .select("*") // Select all columns (customize as needed)
                .eq("id", user.id) // Filter by the user ID
                .single(); // Retrieve a single row (assuming 1-to-1 relation)

            if (error) {
                console.error("Error fetching additional user info: ", error);
                Alert.alert("Error", "There was an issue fetching additional user information: " + error.message);
            } else {
                setAdditionaluseIfo(data);
            }
        } catch (err) {
            console.error("Unexpected error fetching additional user info: ", err);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };

    const updateAdditionalUserInfo = async (additionalUserInfo: AdditionalUserInfo) => {
        if (!user) {
            return;
        }
        const {data, error, status, count} = await supabase.from("additional_user_info").update(additionalUserInfo).eq("id", user.id);
        console.log(data, error, status, count);
        if (error) {
            Alert.alert("Error", "There was an issue updating additional user information: " + error.message);
        }
        fetchAdditionalUserInfo();
    }

    const handleDeactivateAccount = async () => {
        // TODO
    };

    const updateFirstName = async (firstName: string) => {
        if (!additionaluseIfo) {
            return;
        }
        setAdditionaluseIfo({...additionaluseIfo, first_name: firstName});
    }

    const handleSave = async () => {
        if (!additionaluseIfo) {
            return;
        }
        await updateAdditionalUserInfo(additionaluseIfo);
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#221F1F"}}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>

            <View style={{marginLeft: 16}}>
                <Text style={{color: '#fff', fontSize: 24, marginTop: 12, fontWeight: 'bold'}}>Settings</Text>
            </View>

            {/* Display User Data */}
            {user && (
                <View style={styles.userInfo}>
                    <Text style={styles.userInfoText}><Text style={styles.label}>Email: </Text>{user.email || "No email"}</Text>
                    <Text style={styles.userInfoText}><Text style={styles.label}>UID: </Text>{user.id}</Text>
                    <Text style={styles.userInfoText}><Text style={styles.label}>Full Name: </Text>{additionaluseIfo?.first_name}</Text>
                </View>
            )}

            <TextInputField label={'First Name'} value={additionaluseIfo?.first_name ?? ''} onChangeText={updateFirstName}/>

            <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivateAccount}>
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
    },
});
