package org.trinityprayer.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.common.UserProvider
import org.trinityprayer.models.ExpoNotificationPayload
import java.util.UUID

@Service
class AnswerPrayerIntentionService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider,
    private val pushNotificationService: PushNotificationService,
    private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(AnswerPrayerIntentionService::class.java)

    fun answerPrayerIntention(prayerIntentionId: Long) {
        val user = userProvider.getUser()
        val sub = user?.sub?.let { UUID.fromString(it) } ?: throw IllegalStateException("User not signed in")
        val firstName = user.userMetadata?.firstName ?: "Someone"
        val expoPushTokens: List<String> = getExpoPushTokens(prayerIntentionId)

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

        val notificationPayload = ExpoNotificationPayload(
            to = "",
            title = "Prayer Answer",
            body = "$firstName have answered a prayer intention",
        )

        log.info("Sending ${expoPushTokens.size} notifications for prayer intentionId=$prayerIntentionId answererId=$sub")
        for (expoPushToken in expoPushTokens) {
            pushNotificationService.sendExpoNotification(
                notification = notificationPayload.copy(to = expoPushToken),
            )
        }

        log.info("Answered prayer intentionId=$prayerIntentionId answererId=$sub")
    }

    private fun getExpoPushTokens(prayerIntentionId: Long): List<String> {
        val expoPushTokens: List<String> = namedParameterJdbcTemplate.queryForObject(
            """
            SELECT 
                u.raw_user_meta_data->>'expoPushToken' as expoPushTokens
            FROM
                public.prayer_intentions pi
            JOIN
                auth.users u
            ON
                pi.creator_id = u.id
            WHERE
                pi.id = :id
            """.trimIndent(),
            MapSqlParameterSource()
                .addValue("id", prayerIntentionId),
        ) { rs, _ ->
            val json = rs.getString("expoPushTokens")
            if (!json.isNullOrBlank()) objectMapper.readValue(json) else emptyList()
        } ?: emptyList()
        return expoPushTokens
    }

}