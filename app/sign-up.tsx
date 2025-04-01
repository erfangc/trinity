import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {createUserWithEmailAndPassword, EmailAuthProvider, linkWithCredential,} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "@/firebaseConfig";
import {TextInputField} from "@/components/TextInputField";
import CtaButton from "@/components/CtaButton";

export default function SignUp() {
    const router = useRouter();

    // State for form input fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [parish, setParish] = useState("");

    const handleCreateAccount = async () => {
        if (!username || !password || !firstName) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        try {
            const currentUser = auth.currentUser;

            if (currentUser?.isAnonymous) {
                const userDocRef = doc(db, "users", currentUser?.uid);
                const userDoc = await getDoc(userDocRef);
                const existingName = userDoc.exists() ? userDoc.data().name : "";
                console.log("Anonymous user detected. Attempting to link account...");

                const credential = EmailAuthProvider.credential(username, password);
                const linkedUser = await linkWithCredential(currentUser, credential);
                console.log("Anonymous account successfully linked:", linkedUser.user.uid);

                await setDoc(userDocRef, {
                    firstName,
                    lastName,
                    parish,
                    username,
                    name: existingName, // Preserve name
                    createdAt: new Date(),
                });

                Alert.alert("Success", "Account created successfully!");
                router.push("/landing");
            } else {
                console.log("No anonymous user, creating a new account...");
                const userCredential = await createUserWithEmailAndPassword(auth, username, password);
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    firstName,
                    lastName,
                    parish,
                    username,
                    createdAt: new Date(),
                });

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