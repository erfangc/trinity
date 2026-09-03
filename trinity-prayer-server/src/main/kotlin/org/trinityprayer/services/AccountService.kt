package org.trinityprayer.services

import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trinityprayer.common.UserProvider
import java.util.*

/**
 * Permanent account deletion (App Store Review Guideline 5.1.1(v)).
 *
 * Removes everything the user created in this database and then the Supabase auth
 * user itself, all in one transaction. Deleting from auth.users directly is supported
 * by Supabase (its foreign keys cascade to identities, sessions and refresh tokens);
 * the GoTrue Admin API was tried first but times out (504) on this project.
 */
@Service
class AccountService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider,
) {

    private val log = LoggerFactory.getLogger(this.javaClass)

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
        val users = namedParameterJdbcTemplate.update("DELETE FROM auth.users WHERE id = :user_id", params)
        if (users != 1) throw IllegalStateException("Auth user not found")
        log.info("Deleted account userId=$userId intentionsRemoved=$intentions")
    }
}
