package org.trinityprayer.services

import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.common.UserProvider
import java.util.*

/**
 * User-generated-content moderation: reporting a prayer intention and blocking a user.
 *
 * A reported intention is hidden from every feed until an administrator reviews it
 * (App Store Review Guideline 1.2 asks for reports to be acted on within 24 hours);
 * a blocked user's intentions are hidden from the blocker.
 */
@Service
class ModerationService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider,
) {

    private val log = LoggerFactory.getLogger(this.javaClass)

    @PostConstruct
    fun ensureTables() {
        // RLS is enabled with no policies so Supabase's PostgREST (anon / authenticated
        // keys) cannot read these tables; this server connects as postgres and bypasses RLS.
        namedParameterJdbcTemplate.jdbcTemplate.execute(
            """
            CREATE TABLE IF NOT EXISTS public.prayer_intention_reports (
                id                  bigserial PRIMARY KEY,
                prayer_intention_id bigint      NOT NULL REFERENCES public.prayer_intentions (id) ON DELETE CASCADE,
                reporter_id         uuid        NOT NULL,
                reason              text,
                created_at          timestamptz NOT NULL DEFAULT now(),
                UNIQUE (prayer_intention_id, reporter_id)
            );
            ALTER TABLE public.prayer_intention_reports ENABLE ROW LEVEL SECURITY;
            CREATE TABLE IF NOT EXISTS public.user_blocks (
                blocker_id uuid        NOT NULL,
                blocked_id uuid        NOT NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                PRIMARY KEY (blocker_id, blocked_id)
            );
            ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
            """.trimIndent()
        )
    }

    fun reportPrayerIntention(prayerIntentionId: Long, reason: String?) {
        val reporterId = currentUserId()
        namedParameterJdbcTemplate.update(
            """
            INSERT INTO public.prayer_intention_reports (prayer_intention_id, reporter_id, reason)
            VALUES (:prayer_intention_id, :reporter_id, :reason)
            ON CONFLICT (prayer_intention_id, reporter_id) DO NOTHING
            """.trimIndent(),
            MapSqlParameterSource()
                .addValue("prayer_intention_id", prayerIntentionId)
                .addValue("reporter_id", reporterId)
                .addValue("reason", reason?.take(500)),
        )
        log.warn("Prayer intentionId=$prayerIntentionId reported by userId=$reporterId reason=$reason")
    }

    fun blockUser(blockedUserId: UUID) {
        val blockerId = currentUserId()
        if (blockedUserId == blockerId) throw IllegalArgumentException("You cannot block yourself")
        namedParameterJdbcTemplate.update(
            """
            INSERT INTO public.user_blocks (blocker_id, blocked_id)
            VALUES (:blocker_id, :blocked_id)
            ON CONFLICT DO NOTHING
            """.trimIndent(),
            MapSqlParameterSource()
                .addValue("blocker_id", blockerId)
                .addValue("blocked_id", blockedUserId),
        )
        log.info("userId=$blockerId blocked userId=$blockedUserId")
    }

    private fun currentUserId(): UUID =
        userProvider.getUser()?.sub?.let { UUID.fromString(it) } ?: throw IllegalStateException("User not logged in")
}
