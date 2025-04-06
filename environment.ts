import Constants from "expo-constants";


const extra = Constants.manifest2?.extra?.expoClient?.extra;
export const SUPABASE_URL = extra.SUPABASE_URL;
export const TRINITY_API_URL = extra.TRINITY_API_URL;
export const SUPABASE_ANON_KEY = extra.SUPABASE_ANON_KEY;

console.log('-------------- Loaded environment variables: -------------- ');
console.log(`SUPABASE_URL=${SUPABASE_URL}`);
console.log(`TRINITY_API_URL=${TRINITY_API_URL}`);
console.log(`SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`);
console.log('----------------------------------------------------------- ');
