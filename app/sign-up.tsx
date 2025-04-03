import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";
import CtaButton from "@/components/CtaButton";
import {supabase} from "@/supabase";

export default function SignUp() {
    const router = useRouter();

    // State for form input fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [parish, setParish] = useState("");

    const handleCreateAccount = async () => {
        if (!username || !password || !firstName || !lastName) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        try {
            // Get the current session (check if the user is signed in anonymously)
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const anonymousUser = sessionData?.session?.user;
            const isAnonymous = anonymousUser?.email === null;

            if (isAnonymous) {
                // Handle anonymous linking here
                console.log("Anonymous user detected. Linking the account with the new credentials...");

                // Convert the anonymous user to a permanent account
                const { data, error } = await supabase.auth.updateUser({
                    email: username,
                    password,
                });

                if (error) throw error;

                // Insert the user details into the 'additional_user_info' table
                const additionalInfoInsertion = await supabase
                    .from("additional_user_info")
                    .insert({
                        user_id: data.user?.id,
                        first_name: firstName,
                        last_name: lastName,
                        parish,
                        created_at: new Date().toISOString(),
                    });

                if (additionalInfoInsertion.error) throw additionalInfoInsertion.error;

                Alert.alert("Success", "Account successfully linked and updated!");
                router.push("/landing");
            } else {
                // Handle new user sign-up
                console.log("No anonymous user detected. Creating a new account...");

                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: username,
                    password,
                });

                if (signUpError) throw signUpError;

                const userId = signUpData.user?.id;

                console.log(userId);
                // Insert the user details into the 'additional_user_info' table
                const infoInsertion = await supabase
                    .from("additional_user_info")
                    .insert({
                        id: userId,
                        first_name: firstName,
                        last_name: lastName,
                        created_at: new Date().toISOString(),
                    });

                if (infoInsertion.error) throw infoInsertion.error;

                Alert.alert("Success", "Account created successfully!");
                router.push("/landing");
            }
        } catch (error: any) {
            console.error("Error creating account: ", error);
            Alert.alert("Error", error.message || "Failed to create account.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={{gap: 6, marginBottom: 24}}>
                        <TextInputField
                            label="First Name"
                            placeholder="ex: John"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInputField
                            label="Last Name *(Optional)"
                            placeholder="ex: Doe"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <TextInputField
                            label="Username (Email)"
                            placeholder="ex: johndoe123@example.com"
                            value={username}
                            autoCapitalize="none"
                            autoComplete="username"
                            importantForAutofill="yes"
                            textContentType="username"
                            onChangeText={setUsername}
                        />
                        <TextInputField
                            label="Password"
                            placeholder="Password"
                            secureTextEntry
                            autoComplete="password"
                            importantForAutofill="yes"
                            textContentType="password"
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInputField
                            label="Church"
                            value={parish}
                            placeholder="ex: St Francis of Assisi"
                            onChangeText={setParish}
                        />
                    </View>

                    {/* Submit Button */}
                    <View>
                        <CtaButton title="Create Account" onPress={handleCreateAccount}/>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#181818",
        justifyContent: "flex-end",
        padding: 20,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    backButton: {
        position: "absolute",
        zIndex: 1,
        top: 64,
        left: 20,
    },
});