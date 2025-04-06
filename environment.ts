import Constants from "expo-constants";

const extras = Constants.manifest2?.extras || {};
export const SUPABASE_URL = extras.SUPABASE_URL;
export const TRINITY_API_URL = extras.TRINITY_API_URL;
export const SUPABASE_ANON_KEY = extras.SUPABASE_ANON_KEY;

console.log('-------------- Loaded environment variables: -------------- ');
console.log(`SUPABASE_URL=${SUPABASE_URL}`);
console.log(`TRINITY_API_URL=${TRINITY_API_URL}`);
console.log(`SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`);
console.log('----------------------------------------------------------- ');
