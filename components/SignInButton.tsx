import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";

export const SignInButton = () => {
    const router = useRouter();
    return (
    <TouchableOpacity style={styles.button} onPress={() => router.push('/sign-in')}>
        <Text style={styles.buttonText}>Sign In</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
    },
})