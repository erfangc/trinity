import {ImageBackground, StyleSheet, Text, View} from "react-native";
import CtaButton from "@/components/ui/CtaButton";

export default function LandingScreen() {
    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={{marginBottom: 24}}>
                <CtaButton title={"REQUEST A PRAYER"} onPress={() => null}/>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
        alignItems: "center",
    },
});