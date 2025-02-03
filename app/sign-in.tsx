import React, {useEffect, useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInputField } from "@/components/ui/TextInputField";
import CtaButton from "@/components/ui/CtaButton";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase sign-in function
import { auth } from "@/firebaseConfig"; // Import Firebase auth instance
import { useRouter } from "expo-router";
import {getCredentials, saveCredentials} from "@/credentialStorage";

export default function SignIn() {

    const [username, setUsername] = useState(""); // Email
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(
        () => {
            getCredentials('credentials').then(creds => {
                if (creds) {
                    const credentials = JSON.parse(creds) as Credentials;
                    if (credentials.username && credentials.password) {
                        setUsername(credentials.username);
                        setPassword(credentials.password);
                        signIn(credentials.username, credentials.password);
                    }
                }
            });
        },
        [],
    );

    const signIn = async (username: string, password: string) => {
        if (!username || !password) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        try {
            // Try to sign in the user with the provided credentials
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
            await saveCredentials('credentials', JSON.stringify({username, password}));
            router.push("/landing");
        } catch (error: any) {
            console.error("Error signing in: ", error.message);
            Alert.alert("Error", error.message || "Failed to sign in. Please try again.");
        }
    };

    const handleSignIn = async () => {
        await signIn(username, password);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={{ gap: 6, marginBottom: 24 }}>
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
                    </View>

                    {/* Submit Button */}
                    <View>
                        <CtaButton title="Sign In" onPress={handleSignIn} />
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
        justifyContent: "flex-end", // Ensures UI component alignment
    },
    backButton: {
        position: "absolute",
        zIndex: 1,
        top: 64,
        left: 20,
    },
});