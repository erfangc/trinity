import {createClient} from '@supabase/supabase-js'
import {SUPABASE_ANON_KEY, SUPABASE_URL} from "@/environment";
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    },
);
