import {ImageBackground, StyleSheet, Text, TextInput, View} from 'react-native';
import CtaButton from "@/components/ui/CtaButton";
import {GoogleSignUpButton} from "@/components/ui/GoogleSignUpButton";
import {AppleSignUpButton} from "@/components/ui/AppleSignUpButton";
import {useState} from "react";
import {useRouter} from "expo-router";

export default function HomeScreen() {

    const [name, setName] = useState<string>('');
    const router = useRouter(); // Access the router instance

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>

                <Text style={styles.title}>Login Page</Text>

                <AppleSignUpButton/>
                <GoogleSignUpButton/>

                {/* Separator */}
                <View style={styles.separator}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                {/* Input Field */}
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#D9D9D9"
                    onChangeText={(text) => setName(text)}
                />

                {/* Confirm Button */}
                <View style={styles.confirmButton}>
                    <CtaButton title="CONFIRM" onPress={() => router.push('/landing')}/>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover", // Cover the whole screen
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        width: "85%",
        backgroundColor: "rgba(50, 50, 50, 0.7)", // Semi-transparent overlay
        padding: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    title: {
        color: "#D9D9D9",
        fontSize: 16,
        marginBottom: 20,
    },
    separator: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
        width: "100%",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#D9D9D9",
    },
    orText: {
        color: "#D9D9D9",
        marginHorizontal: 10,
    },
    label: {
        color: "#D9D9D9",
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 5,
        width: "100%",
    },
    confirmButton: {
        marginTop: 15,
    },
    confirmText: {
        color: "#FFF",
        fontSize: 16,
    },
});
