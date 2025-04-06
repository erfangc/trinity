import React, {useState} from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import CtaButton from "@/components/CtaButton";
import {useRouter} from "expo-router";

export function CreatePrayerIntentionScreen() {

    const router = useRouter();
    const [intentText, setIntentText] = useState('');

    const handleSubmit = async () => {
        if (!intentText.trim()) {
            Alert.alert("Error", "Please enter a prayer intention.");
            return;
        }

        // TODO
        Alert.alert(
            "Submitted",
            "Your prayer intention has been submitted. We will notify you when a fellow member prays for you."
        );
        // Clear the input field after submission
        setIntentText('');
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>

            {/* Make the screen scrollable and adjust with keyboard */}
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined} // Use 'padding' for iOS, 'height' (default) for Android
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Prayer Intention Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>PRAYER INTENTION</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your prayer intention here. This can be anything you wish to share about your current situation in life"
                            placeholderTextColor="#B0B0B0"
                            value={intentText}
                            onChangeText={setIntentText}
                            multiline
                        />
                    </View>

                    {/* Submit Button */}
                    <View style={styles.ctaButtonContainer}>
                        <CtaButton title="Submit Request" onPress={handleSubmit}/>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// Styles
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
    inputContainer: {
        marginTop: 120, // Adjusted for spacing
    },
    label: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#3A3A3A",
        color: "white",
        padding: 15,
        borderRadius: 8,
        textAlignVertical: "top",
    },
    ctaButtonContainer: {
        marginTop: 20,
    }
});

export default CreatePrayerIntentionScreen;