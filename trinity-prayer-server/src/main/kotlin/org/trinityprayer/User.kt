package org.trinityprayer

import com.fasterxml.jackson.annotation.JsonProperty

data class SupabaseJwtPayload(
    @JsonProperty("iss")
    val iss: String? = null,

    @JsonProperty("sub")
    val sub: String? = null,

    @JsonProperty("aud")
    val aud: String? = null,

    @JsonProperty("exp")
    val exp: Long? = null,

    @JsonProperty("iat")
    val iat: Long? = null,

    @JsonProperty("email")
    val email: String? = null,

    @JsonProperty("phone")
    val phone: String? = null,

    @JsonProperty("app_metadata")
    val appMetadata: AppMetadata? = null,

    @JsonProperty("user_metadata")
    val userMetadata: UserMetadata? = null,

    @JsonProperty("role")
    val role: String? = null,

    @JsonProperty("aal")
    val aal: String? = null,

    @JsonProperty("amr")
    val amr: List<AmrMethod>? = null,

    @JsonProperty("session_id")
    val sessionId: String? = null,

    @JsonProperty("is_anonymous")
    val isAnonymous: Boolean? = null
)

data class AppMetadata(
    @JsonProperty("provider")
    val provider: String? = null,

    @JsonProperty("providers")
    val providers: List<String>? = null
)

data class UserMetadata(
    @JsonProperty("email")
    val email: String? = null,

    @JsonProperty("email_verified")
    val emailVerified: Boolean? = null,

    @JsonProperty("first_name")
    val firstName: String? = null,

    @JsonProperty("last_name")
    val lastName: String? = null,

    @JsonProperty("phone_verified")
    val phoneVerified: Boolean? = null,

    @JsonProperty("sub")
    val sub: String? = null
)

data class AmrMethod(
    @JsonProperty("method")
    val method: String? = null,

    @JsonProperty("timestamp")
    val timestamp: Long? = null
)
