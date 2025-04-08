import {Alert, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import CtaButton from "@/components/CtaButton";
import {SignInButton} from "@/components/SignInButton";
import React, {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {SignUpButton} from "@/components/SignUpButton";
import {OrSeparator} from "@/components/OrSeparator";
import {PlayPauseIcon} from "@/components/PlayPauseIcon";
import {supabase} from "@/supabase";
import {useUser} from "@/hooks/useUser";

export default function HomeScreen() {

    const [firstName, setFirstName] = useState<string>('');
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (user) {
            router.push('/landing');
        }
    }, [user]);

    const handleSignUpAnonymously = async () => {
        const {error} = await supabase.auth.signInAnonymously(
            {
                options: {
                    data: {first_name: firstName}
                }
            }
        );

        if (error) {
            Alert.alert("Error", error.message || "Failed to sign in. Please try again.");
        } else {
            router.push('/landing');
        }
    }

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={{marginRight: 20}}>
                    <PlayPauseIcon/>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.overlay}>
                        <Text style={styles.title}>Login Page</Text>
                        <SignInButton/>
                        <SignUpButton/>
                        <OrSeparator/>

                        {/* Input Field */}
                        <Text style={styles.label}>Your First Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="#D9D9D9"
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                        />

                        {/* Confirm Button */}
                        <View style={styles.confirmButton}>
                            <CtaButton title="CONFIRM" onPress={handleSignUpAnonymously}/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
    },
    buttonContainer: {},
    contentContainer: {
        flex: 1, justifyContent: "center", alignItems: "center"
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
