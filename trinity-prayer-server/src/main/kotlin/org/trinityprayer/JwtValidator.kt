package org.trinityprayer

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.stereotype.Service

@Service
class JwtValidator {

    private val supabaseProjectUrl: String = System.getenv("SUPABASE_URL")
    private val jwtSecret = System.getenv("SUPABASE_JWT_SECRET")

    @Throws(JWTVerificationException::class)
    fun validate(token: String): DecodedJWT {
        val algorithm = Algorithm.HMAC256(jwtSecret)
        val verifier = JWT.require(algorithm)
            .withIssuer("$supabaseProjectUrl/auth/v1")
            .build()
        return verifier.verify(token)
    }

}
