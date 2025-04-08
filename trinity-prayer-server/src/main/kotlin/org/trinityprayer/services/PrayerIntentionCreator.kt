package org.trinityprayer.services

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.stereotype.Service
import org.trinityprayer.common.UserProvider
import org.trinityprayer.models.CreatePrayerIntentionRequest
import org.trinityprayer.models.PrayerIntention
import java.util.*

@Service
class PrayerIntentionCreator(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider,
) {

    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    fun createPrayerIntention(request: CreatePrayerIntentionRequest): PrayerIntention {
        val keyHolder = GeneratedKeyHolder()
        val user = userProvider.getUser()
        val sub = user?.sub?.let { UUID.fromString(it) } ?: throw IllegalStateException("User not signed in")

        namedParameterJdbcTemplate.update(
            """
            INSERT INTO public.prayer_intentions (creator_id, intention_text) 
            VALUES (:creator_id, :intention_text)
            """.trimIndent(),

            MapSqlParameterSource()
                .addValue("creator_id", sub)
                .addValue("intention_text", request.intentText),
            keyHolder
        )
        // TODO select a person to pray for this person and send notification
        val id = keyHolder.keys?.get("id")?.toString()?.toLong()!!
        log.info("Created prayer intentionId=$id creatorId=$sub")
        return PrayerIntention(
            id = id,
            intentionText = request.intentText,
        )
    }

}