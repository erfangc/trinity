import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";

export function SignUpButton() {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push('/sign-up')}>
            <Text style={styles.text}>Sign Up</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "rgba(40,40,40, 0.7)",
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: "center"
    },
    text: {
        color: "white",
    },
});