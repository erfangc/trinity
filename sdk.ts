import {TrinityPrayerControllerApi} from "@/generated-sdk";
import axios from "axios";
import {supabase} from "@/supabase";
import {TRINITY_API_URL} from "@/environment";

axios.interceptors.request.use(
    async (config) => {
        const {data} = await supabase.auth.getSession();
        const accessToken = data.session?.access_token
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

export const api = new TrinityPrayerControllerApi(undefined, TRINITY_API_URL);



/**
 * Endpoints added after the generated SDK was last regenerated (run
 * `./generate-sdk.sh` against a running server to fold them into `generated-sdk/`).
 */
export const accountApi = {
    deleteMyAccount: () => axios.delete(`${TRINITY_API_URL}/api/v1/me`),
    reportPrayerIntention: (prayerIntentionId: number, reason?: string) =>
        axios.post(`${TRINITY_API_URL}/api/v1/prayer-intentions/${prayerIntentionId}/report`, {reason}),
    blockUser: (userId: string) => axios.post(`${TRINITY_API_URL}/api/v1/users/${userId}/block`),
};
