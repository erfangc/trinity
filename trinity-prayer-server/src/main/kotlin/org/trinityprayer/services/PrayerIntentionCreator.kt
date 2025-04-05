package org.trinityprayer.services

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.stereotype.Service
import org.trinityprayer.common.UserProvider
import org.trinityprayer.models.CreatePrayerIntentionRequest
import org.trinityprayer.models.PrayerIntention

@Service
class PrayerIntentionCreator(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val userProvider: UserProvider,
) {

    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    fun createPrayerIntention(request: CreatePrayerIntentionRequest): PrayerIntention {
        val keyHolder = GeneratedKeyHolder()
        namedParameterJdbcTemplate.update(
            """
            INSERT INTO public.prayer_intentions (creator_id, intention_text) 
            VALUES (:creator_id, :intention_text)
        """.trimIndent(),
            MapSqlParameterSource()
                .addValue("creator_id", userProvider.getUser()?.sub)
                .addValue("intention_text", request.intentText),
            keyHolder
        )
        log.info("Created prayer intention id=${keyHolder.key}")
        // TODO select a person to pray for this person and send notification
        return PrayerIntention(
            id = keyHolder.key?.toLong()!!,
            intentionText = request.intentText,
        )
    }

}