import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export const GoogleSignUpButton = () => {
    return (
        <TouchableOpacity style={styles.button}>
            <View style={styles.innerContainer}>
                <Image source={require("../../assets/images/google-logo.png")} style={styles.icon} />
                <Text style={styles.text}>Sign up with Google</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#000", // Black button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30, // Rounded edges
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "80%", // Adjust width as needed
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    text: {
        color: "#FFF", // White text
        fontSize: 16,
        fontWeight: "bold",
    },
});
