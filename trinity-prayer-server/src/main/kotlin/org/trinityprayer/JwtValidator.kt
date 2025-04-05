package org.trinityprayer

import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.stereotype.Service
import java.net.URI
import java.security.interfaces.RSAPublicKey
import java.util.concurrent.TimeUnit

@Service
class JwtValidator {

    private val supabaseProjectUrl: String = "https://trinityprayer.supabase.co"
    private val issuer = "$supabaseProjectUrl/auth/v1"
    private val jwksUrl = "$issuer/keys"
    private val url = URI.create(jwksUrl).toURL()
    private val jwkProvider = JwkProviderBuilder(url)
        .cached(10, 24, TimeUnit.HOURS)
        .build()

    fun validate(token: String): DecodedJWT {
        val jwt = JWT.decode(token)
        val jwk = jwkProvider.get(jwt.keyId)
        val algorithm = Algorithm.RSA256(jwk.publicKey as RSAPublicKey, null)

        val verifier = JWT
            .require(algorithm)
            .withIssuer(issuer)
            .build()

        return verifier.verify(token)
    }

}