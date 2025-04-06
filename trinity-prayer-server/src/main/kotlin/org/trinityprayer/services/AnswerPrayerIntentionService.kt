package org.trinityprayer.services

import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.common.UserProvider
import java.util.UUID

@Service
class AnswerPrayerIntentionService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider
) {
    private val log = LoggerFactory.getLogger(AnswerPrayerIntentionService::class.java)

    fun answerPrayerIntention(prayerIntentionId: Long) {
        val sub = userProvider.getUser()?.sub?.let { UUID.fromString(it) } ?: throw IllegalStateException("User not signed in")
        namedParameterJdbcTemplate
            .update(
                """
                UPDATE public.prayer_intentions
                SET answerer_id = :answerer_id, answered_at = now()
                WHERE id = :prayer_intention_id
                """.trimIndent(),
                MapSqlParameterSource()
                    .addValue("prayer_intention_id", prayerIntentionId)
                    .addValue("answerer_id", sub),
            )
        // TODO send expo notification
        log.info("Answered prayer intentionId=$prayerIntentionId answererId=$sub")
    }

}