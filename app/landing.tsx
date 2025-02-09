import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CtaButton from "@/components/ui/CtaButton";
import {useRouter} from "expo-router";
import {signOut} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {fetchPrayIntentions} from "@/fetchPrayerIntetions";
import {MaterialIcons} from "@expo/vector-icons";
import {auth} from "@/firebaseConfig";  // Expo supports this out of the box

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

    const [prayerIntentions, setPrayerIntentions] = useState<PrayerIntention[]>([]);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => router.push('/'))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        return fetchPrayIntentions(10, prayerIntentions => setPrayerIntentions(prayerIntentions));
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
                    <PrayerRequestCard
                        key={prayerIntention.id}
                        name={prayerIntention.from}
                        onPress={() =>
                            router.push(`/prayer-intentions/${prayerIntention.id}`)
                        }
                    />
                ))}
                {
                    prayerIntentions.length === 0 ?
                        <View style={{opacity: 0.9, backgroundColor: '#7E4D26', padding: 24, borderRadius: 8}}>
                            <Text style={{color:'#fff'}}>
                                There are currently no prayer intentions available. Please check back later!
                            </Text>
                        </View>
                         : null
                }
            </SafeAreaView>
            <View style={{marginBottom: 24}}>
                <CtaButton title={"REQUEST A PRAYER"} onPress={() => router.push('/create-prayer-intention')}/>
                <TouchableOpacity style={styles.signOutContainer}
                                  onPress={() => router.push('/create-prayer-intention')}>
                    <Text style={styles.signOutText} onPress={handleSignOut}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    signOutContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    signOutText: {
        color: "#fff",
    },
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
        backgroundColor: "#7E4D26",
        opacity: 0.9,
        borderRadius: 10,
    },
    text: {
        color: "#B1AA91",
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
