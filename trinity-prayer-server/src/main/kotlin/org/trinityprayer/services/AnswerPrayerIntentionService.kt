package org.trinityprayer.services

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
    private val pushNotificationService: PushNotificationService
) {
    private val log = LoggerFactory.getLogger(AnswerPrayerIntentionService::class.java)

    fun answerPrayerIntention(prayerIntentionId: Long) {
        val user = userProvider.getUser()
        val sub = user?.sub?.let { UUID.fromString(it) } ?: throw IllegalStateException("User not signed in")
        val firstName = user.userMetadata?.firstName ?: "Someone"

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

        val expoPushTokens = user.userMetadata?.expoPushTokens ?: emptyList()
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

}