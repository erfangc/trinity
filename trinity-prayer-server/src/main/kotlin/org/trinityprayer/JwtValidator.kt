package org.trinityprayer

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.DecodedJWT
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
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

fun main() {
    val decodedJWT = JwtValidator()
        .validate("eyJhbGciOiJIUzI1NiIsImtpZCI6IlZWaUdoLzY1ZWIxWGZLbVkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2R4YmVwZW9zYWZncXdvcmN1eWN6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJiYjAxNmI1YS0zNmVkLTQ3ZDYtYWYxZi1kOWFiYzQxNGE1Y2EiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQzODY1MTQ3LCJpYXQiOjE3NDM4NjE1NDcsImVtYWlsIjoiZXJmYW5nY0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiZXJmYW5nY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyc3RfbmFtZSI6IkVyZmFuZyIsImxhc3RfbmFtZSI6IkNoZW4iLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImJiMDE2YjVhLTM2ZWQtNDdkNi1hZjFmLWQ5YWJjNDE0YTVjYSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQzODYxNTQ3fV0sInNlc3Npb25faWQiOiJiOTBjYThmZS00OTNmLTQ1NjctYjU2NC0yM2RhNmZkMGIwYzEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.rHYkhDR8oxm2wy7wN5bLdWetXZSpKMVV6GwxKd7r928")
    println(decodedJWT.token)
    println(decodedJWT.payload)
    println(decodedJWT.claims)
    val userProvider = UserProvider(jacksonObjectMapper())
    userProvider.setUser(decodedJWT.token)
    val supabaseJwtPayload = userProvider.getUser()
    println(supabaseJwtPayload)
    println(supabaseJwtPayload?.userMetadata?.firstName)
}