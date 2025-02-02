import {StyleSheet, Text, View} from "react-native";

export function OrSeparator() {
    return <View style={styles.separator}>
        <View style={styles.line}/>
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line}/>
    </View>;
}

const styles = StyleSheet.create({
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
});