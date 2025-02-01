import {ImageBackground, StyleSheet, Text, View} from "react-native";
import CtaButton from "@/components/ui/CtaButton";
import {useRouter} from "expo-router";

export default function LandingScreen() {
    const router = useRouter()
    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={{marginBottom: 24}}>
                <CtaButton title={"REQUEST A PRAYER"} onPress={() => router.push('/create-prayer-intention')}/>
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