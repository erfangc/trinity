import {Alert} from "react-native";
import {supabase} from "@/supabase"; // Your Firebase setup file

export const addPrayIntention = async (
    prayerIntention: { intention_text: string }
) => {
    const {data, error} = await supabase.auth.getSession();
    if (error) {
        Alert.alert("Error logging in: ", error.message);
    } else {
        const userId = data.session?.user?.id;
        return supabase
            .from('prayer_intentions')
            .insert([{
                creator_id: userId,
                intention_text: prayerIntention.intention_text,
            }]);

    }
};