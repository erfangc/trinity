package org.trinityprayer.common

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserProvider(private val objectMapper: ObjectMapper) {

    private val user: ThreadLocal<SupabaseJwtPayload> = ThreadLocal()

    private fun decodeJWTPayload(jwt: String): String {
        val parts = jwt.split(".")
        if (parts.size < 2) {
            throw IllegalArgumentException("Invalid JWT")
        }
        return String(Base64.getDecoder().decode(parts[1]))
    }

    fun clearUser() {
        user.remove()
    }

    fun setUser(token: String) {
        val decodedPayload = decodeJWTPayload(token)
        user.set(objectMapper.readValue(decodedPayload))
    }

    fun setUser(input: SupabaseJwtPayload) {
        user.set(input)
    }

    fun getUser(): SupabaseJwtPayload? {
        return user.get()
    }

}
