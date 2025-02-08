import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CtaButton from "@/components/ui/CtaButton";
import {useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {fetchPrayIntentions} from "@/fetchPrayerIntetions";
import {MaterialIcons} from "@expo/vector-icons";  // Expo supports this out of the box

const PrayerRequestCard: React.FC<{ name: string, onPress: () => void }> = ({name = "John", onPress}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View
                style={styles.background1}
            >
                <View style={styles.overlay}/>
                <Text style={styles.text}>{name} requested A Prayer</Text>
                <MaterialIcons name="chevron-right" size={24} color="#FFD700" style={styles.icon}/>
            </View>
        </TouchableOpacity>
    );
};

export default function LandingScreen() {

    const [prayerIntentions, setPrayerIntentions] = useState<PrayIntention[]>([]);

    useEffect(() => {
        fetchPrayIntentions(10).then(resp => setPrayerIntentions(resp));
    }, []);

    const router = useRouter()

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={{flex: 1, justifyContent: 'flex-start', gap: 16}}>
                {prayerIntentions.map(prayerIntention => (
                    <>
                        <PrayerRequestCard
                            key={prayerIntention.id}
                            name={prayerIntention.from}
                            onPress={() =>
                            router.push(`/prayer-intentions/${prayerIntention.id}`)
                        }/>
                    </>
                ))}
            </SafeAreaView>
            <View style={{marginBottom: 24}}>
                <CtaButton title={"REQUEST A PRAYER"} onPress={() => router.push('/create-prayer-intention')}/>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    card: {
        width: 330,
        height: 40,
        borderRadius: 10,
        overflow: "hidden",
    },
    background1: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        position: "relative",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#7E4D26", // Brown background
        opacity: 0.9, // Matches 90% opacity in your design
        borderRadius: 10,
    },
    text: {
        color: "#B1AA91", // Light grayish color in your UI
        fontSize: 14,
        fontWeight: "500",
        textTransform: "uppercase",
        flex: 1,
    },
    icon: {
        marginRight: 10,
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
