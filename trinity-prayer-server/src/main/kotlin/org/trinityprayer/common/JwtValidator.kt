package org.trinityprayer.common

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.stereotype.Service
import org.trinityprayer.common.Environment.SUPABASE_JWT_SECRET
import org.trinityprayer.common.Environment.SUPABASE_URL

@Service
class JwtValidator {

    @Throws(JWTVerificationException::class)
    fun validate(token: String): DecodedJWT {
        val algorithm = Algorithm.HMAC256(SUPABASE_JWT_SECRET)
        val verifier = JWT.require(algorithm)
            .withIssuer("$SUPABASE_URL/auth/v1")
            .build()
        return verifier.verify(token)
    }

}
