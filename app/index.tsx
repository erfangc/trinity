import {ImageBackground, StyleSheet, Text, TextInput, View} from 'react-native';
import CtaButton from "@/components/ui/CtaButton";
import {SignInButton} from "@/components/ui/SignInButton";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SignUpButton} from "@/components/ui/SignUpButton";
import {OrSeparator} from "@/components/ui/OrSeparator";

export default function HomeScreen() {

    const [name, setName] = useState<string>('');
    const router = useRouter(); // Access the router instance

    useEffect(() => {
        AsyncStorage
            .getItem('name')
            .then(value => setName(value || ''))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (name !== undefined && name !== null) {
            AsyncStorage.setItem('name', name);
        }
    }, [name]);

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>

                <Text style={styles.title}>Login Page</Text>
                <SignInButton/>
                <SignUpButton/>
                <OrSeparator/>

                {/* Input Field */}
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#D9D9D9"
                    value={name}
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
