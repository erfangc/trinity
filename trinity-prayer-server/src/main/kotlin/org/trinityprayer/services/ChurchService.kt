package org.trinityprayer.services

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.common.Environment.SUPABASE_URL
import org.trinityprayer.common.UserMetadata
import org.trinityprayer.common.UserProvider
import org.trinityprayer.models.Church
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpRequest.BodyPublishers
import java.net.http.HttpResponse

@Service
class ChurchService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val objectMapper: ObjectMapper,
    private val userProvider: UserProvider
) {

    private val httpClient = HttpClient.newHttpClient()
    private val log = LoggerFactory.getLogger(this.javaClass)

    fun getChurchForUser(userId: String): Church? {
        val church = namedParameterJdbcTemplate
            .queryForObject(
                """
                SELECT
                    id, created_at, name, google_place_id, latitude, longitude
                FROM
                    public.churches
                WHERE id = (SELECT raw_user_meta_data->>'church_id' FROM auth.users WHERE id = :userId)
                """.trimIndent(),
                MapSqlParameterSource()
                    .addValue("userId", userId)
            ) { rs, _ ->
                Church(
                    id = rs.getLong("id"),
                    name = rs.getString("name"),
                    googlePlaceId = rs.getString("google_place_id"),
                    latitude = rs.getDouble("latitude"),
                    longitude = rs.getDouble("longitude"),
                    createdAt = rs.getTimestamp("created_at").toInstant(),
                )
            }
        log.info("Found church ${church?.id} for userId=$userId")
        return church
    }

    fun setChurchForUser(churchId: Long) {
        val user = userProvider.getUser()
        val sub = user?.sub

        val payload = if (user?.userMetadata == null) {
            UserMetadata(churchId = churchId)
        } else {
            user.userMetadata.copy(churchId = churchId)
        }

        val httpRequest = HttpRequest
            .newBuilder()
            .PUT(BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
            .uri(URI.create("$SUPABASE_URL/auth/v1/admin/users/$sub"))
            .build()

        log.info("Calling ${httpRequest.method()} ${httpRequest.uri()}")
        val httpResponse = httpClient.send(
            httpRequest,
            HttpResponse.BodyHandlers.ofString()
        )
        val body = httpResponse.body()
        log.info("Finished calling ${httpRequest.method()} ${httpRequest.uri()} status=${httpResponse.statusCode()} responseBody=$body")
    }

    fun getChurches(): List<Church> {
        return namedParameterJdbcTemplate.query(
            """
            SELECT
                id, created_at, name, google_place_id, latitude, longitude
            FROM
                public.churches
            """.trimIndent(),
        ) {
            rs, _ ->
                Church(
                    id = rs.getLong("id"),
                    name = rs.getString("name"),
                    googlePlaceId = rs.getString("google_place_id"),
                    latitude = rs.getDouble("latitude"),
                    longitude = rs.getDouble("longitude"),
                    createdAt = rs.getTimestamp("created_at").toInstant(),
                )
        }
    }

}