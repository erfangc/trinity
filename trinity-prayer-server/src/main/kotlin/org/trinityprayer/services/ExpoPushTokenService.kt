package org.trinityprayer.services

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.common.Environment.SUPABASE_URL
import org.trinityprayer.common.UserProvider
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpRequest.BodyPublishers
import java.net.http.HttpResponse

@Service
class ExpoPushTokenService(
    private val userProvider: UserProvider,
    private val objectMapper: ObjectMapper,
) {

    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)
    private val httpClient = HttpClient.newHttpClient()

    fun getPushTokens(): List<String> {
        return userProvider.getUser()?.userMetadata?.expoPushTokens ?: emptyList()
    }

    fun addPushToken(token: String) {

        val user = userProvider.getUser()
        val userMetadata = user?.userMetadata
        val expoPushTokens = userMetadata?.expoPushTokens ?: emptyList()
        val expoPushTokensUpdated = expoPushTokens.plus(token).distinct()

        val payload = userMetadata?.copy(
            expoPushTokens = expoPushTokensUpdated,
        )
        val httpRequest = HttpRequest
            .newBuilder()
            .PUT(BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
            .uri(URI.create("$SUPABASE_URL/auth/v1/admin/users/${user?.sub}"))
            .build()

        log.info("Calling ${httpRequest.method()} ${httpRequest.uri()}")
        val httpResponse = httpClient.send(
            httpRequest,
            HttpResponse.BodyHandlers.ofString()
        )
        val body = httpResponse.body()
        log.info("Finished calling ${httpRequest.method()} ${httpRequest.uri()} status=${httpResponse.statusCode()} responseBody=$body")
    }

}