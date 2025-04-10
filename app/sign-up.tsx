import React, {useState} from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TextInputField} from "@/components/TextInputField";
import CtaButton from "@/components/CtaButton";
import {supabase} from "@/supabase";
import ChurchSelector from "@/components/ChurchSelector";

export default function SignUp() {

    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [churchId, setChurchId] = useState<number>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateAccount = async () => {

        if (!email || !password || !firstName || !lastName) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        // Get the current session (check if the user is signed in anonymously)
        const {data: sessionData, error: sessionError} = await supabase.auth.getSession();
        if (sessionError) {
            Alert.alert("Error", sessionError.message || "Failed to get session.");
            return;
        }

        const anonymousUser = sessionData?.session?.user;
        const isAnonymous = anonymousUser?.is_anonymous;

        const payload: any = {
            first_name: firstName,
            last_name: lastName,
        };

        if (churchId) {
            payload['church_id'] = churchId;
        }

        if (isAnonymous) {
            // Convert the anonymous user to a permanent account
            const {error} = await supabase.auth.updateUser({
                email,
                password,
                data: payload,
            });

            if (error) {
                Alert.alert("Error", error.message || "Failed to link account.");
                return;
            } else {
                Alert.alert("Success", "Account successfully linked and updated!");
                setTimeout(() => router.push("/landing"));
            }

        } else {
            const {error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: "https://trinityprayer.org/confirm-email.html",
                    data: payload,
                },
            });

            if (error) {
                Alert.alert("Error", error.message || "Failed to create account.");
            } else {
                Alert.alert("Success", "Account created successfully! Please confirm your email to sign in.");
                setTimeout(() => router.push("/sign-in"));
            }
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={{marginLeft: 16}}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={{gap: 6}}>
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
                    <ChurchSelector
                        churchId={churchId}
                        onChange={setChurchId}
                    />
                </View>

                {/* Submit Button */}
                <View>
                    <CtaButton title="Create Account" onPress={handleCreateAccount}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#181818",
    },
    keyboardAvoidingContainer: {
        flex: 1,
        marginTop: 32,
        marginHorizontal: 16,
    },
});