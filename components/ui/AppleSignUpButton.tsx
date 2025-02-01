import {StyleSheet, Text, TouchableOpacity} from "react-native";

export const AppleSignUpButton = () => {
    return (
    <TouchableOpacity style={styles.appleButton}>
        <Text style={styles.buttonText}> Sign in with Apple</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    appleButton: {
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