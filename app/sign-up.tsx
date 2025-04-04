import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";
import CtaButton from "@/components/CtaButton";
import {supabase} from "@/supabase";

export default function SignUp() {

    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateAccount = async () => {

        if (!email || !password || !firstName || !lastName) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        // Get the current session (check if the user is signed in anonymously)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            Alert.alert("Error", sessionError.message || "Failed to get session.");
            return;
        }

        const anonymousUser = sessionData?.session?.user;
        const isAnonymous = anonymousUser?.is_anonymous;
        let id = anonymousUser?.id;

        if (isAnonymous) {
            // Convert the anonymous user to a permanent account
            const { data, error } = await supabase.auth.updateUser({
                email,
                password,
            });

            if (error) {
                Alert.alert("Error", error.message || "Failed to link account.");
                return;
            } else {
                Alert.alert("Success", "Account successfully linked and updated!");
                setTimeout(() => router.push("/landing"));
            }

        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            console.log(JSON.stringify(data), JSON.stringify(error));
            if (error) {
                Alert.alert("Error", error.message || "Failed to create account.");
            } else {
                id = data?.user?.id;
                Alert.alert("Success", "Account created successfully! Please confirm your email to sign in.");
                setTimeout(() => router.push("/sign-in"));
            }
        }

        // Call the edge function to insert additional user information
        console.log(`Calling edge function with id: ${id} and name: ${firstName} ${lastName}`);
        const {data, error} = await supabase.functions.invoke("insert_user_metadata", {
            method: "POST",
            body: {
                id,
                first_name: firstName,
                last_name: lastName,
                primary_church_id: null,
            },
        });
        console.log(`Edge function response: ${data}`);

        if (error) {
            console.error(JSON.stringify(data), JSON.stringify(error));
            Alert.alert("Error", error.message || "Failed to insert additional user info.");
            return;
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
                            label="Email"
                            placeholder="ex: johndoe123@example.com"
                            value={email}
                            autoCapitalize="none"
                            autoComplete="email"
                            importantForAutofill="yes"
                            textContentType="emailAddress"
                            onChangeText={setEmail}
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
                            placeholder="ex: St Francis of Assisi"
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