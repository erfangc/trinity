package org.trinityprayer.common

object Environment {
    val SUPABASE_POSTGRES_PASSWORD: String = System.getenv("SUPABASE_POSTGRES_PASSWORD")
    val SUPABASE_URL: String = System.getenv("SUPABASE_URL")
    val SUPABASE_SERVICE_ROLE_KEY: String = System.getenv("SUPABASE_SERVICE_ROLE_KEY")
    val SUPABASE_JWT_SECRET: String = System.getenv("SUPABASE_JWT_SECRET")
}