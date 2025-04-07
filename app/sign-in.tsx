import React, {useRef, useState} from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {TextInputField} from "@/components/TextInputField";
import CtaButton from "@/components/CtaButton";
import {useRouter} from "expo-router";
import {supabase} from "@/supabase";

export default function SignIn() {

    const [email, setEmail] = useState(""); // Email
    const [password, setPassword] = useState("");
    const router = useRouter();

    const passwordInputRef = useRef<TextInput>(null); // Ref for the password input

    const signIn = async (username: string, password: string) => {
        if (!username || !password) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }
        const {error} = await supabase.auth.signInWithPassword({email: username, password});
        if (error) {
            Alert.alert("Error", error.message || "Failed to sign in. Please try again.");
        }
    };

    const handleSignIn = async () => {
        await signIn(email, password);
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
                            label="Email"
                            placeholder="ex: johndoe123@example.com"
                            value={email}
                            autoCapitalize="none"
                            autoComplete="email"
                            importantForAutofill="yes"
                            textContentType="emailAddress"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
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
                            ref={passwordInputRef}
                            onSubmitEditing={handleSignIn}
                            onChangeText={setPassword}
                        />
                    </View>

                    <View>
                        <CtaButton title="Sign In" onPress={handleSignIn}/>
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