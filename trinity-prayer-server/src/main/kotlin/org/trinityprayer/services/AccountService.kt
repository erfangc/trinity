package org.trinityprayer.services

import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trinityprayer.common.Environment.SUPABASE_SERVICE_ROLE_KEY
import org.trinityprayer.common.Environment.SUPABASE_URL
import org.trinityprayer.common.UserProvider
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.util.*

/**
 * Permanent account deletion (App Store Review Guideline 5.1.1(v)).
 *
 * Removes everything the user created in this database, then deletes the Supabase
 * auth user through the Admin API, which cascades to identities, sessions and tokens.
 */
@Service
class AccountService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider,
) {

    private val log = LoggerFactory.getLogger(this.javaClass)
    private val httpClient = HttpClient.newHttpClient()

    @Transactional
    fun deleteMyAccount() {
        val user = userProvider.getUser() ?: throw IllegalStateException("User not logged in")
        if (user.sub == "root") throw IllegalStateException("The service account cannot be deleted")
        val userId = UUID.fromString(user.sub)
        val params = MapSqlParameterSource().addValue("user_id", userId)

        val intentions = namedParameterJdbcTemplate.update(
            "DELETE FROM public.prayer_intentions WHERE creator_id = :user_id", params
        )
        namedParameterJdbcTemplate.update(
            "UPDATE public.prayer_intentions SET answerer_id = NULL, answered_at = NULL WHERE answerer_id = :user_id",
            params
        )
        namedParameterJdbcTemplate.update(
            "DELETE FROM public.prayer_intention_reports WHERE reporter_id = :user_id", params
        )
        namedParameterJdbcTemplate.update(
            "DELETE FROM public.user_blocks WHERE blocker_id = :user_id OR blocked_id = :user_id", params
        )

        val request = HttpRequest.newBuilder()
            .uri(URI.create("${SUPABASE_URL.trimEnd('/')}/auth/v1/admin/users/$userId"))
            .header("apikey", SUPABASE_SERVICE_ROLE_KEY)
            .header("Authorization", "Bearer $SUPABASE_SERVICE_ROLE_KEY")
            .DELETE()
            .build()
        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        if (response.statusCode() !in 200..299 && response.statusCode() != 404) {
            log.error("Supabase admin delete failed for userId=$userId status=${response.statusCode()} body=${response.body()}")
            throw IllegalStateException("Failed to delete account")
        }
        log.info("Deleted account userId=$userId intentionsRemoved=$intentions supabaseStatus=${response.statusCode()}")
    }
}
