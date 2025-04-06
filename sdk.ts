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


