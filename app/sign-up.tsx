import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import CtaButton from "@/components/ui/CtaButton";
import React from "react";
import {TextInputField} from "@/components/ui/TextInputField";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

export default function SignUp() {
    const router = useRouter();
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
                            value=""
                            onChangeText={() => null}
                        />
                        <TextInputField
                            label="Last Name *(Optional)"
                            value=""
                            onChangeText={() => null}
                        />
                        <TextInputField
                            label="Parish" value=""
                            placeholder="ex: St Francis of Assisi"
                            onChangeText={() => null}
                        />
                    </View>

                    {/* Submit Button */}
                    <View>
                        <CtaButton title="Create Account" onPress={() => null}/>
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
        justifyContent: 'flex-end',
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


