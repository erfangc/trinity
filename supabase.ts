import {createClient} from '@supabase/supabase-js'

export const supabase = createClient(
    "https://dxbepeosafgqworcuycz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YmVwZW9zYWZncXdvcmN1eWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mjc0MTMsImV4cCI6MjA1OTIwMzQxM30.sm9fzPCzeVrHJMJxAd0dVeCezteREKFJTktlH9VNxFI"
);