package org.trinityprayer.services

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.models.PrayerIntention
import org.trinityprayer.models.PrayerIntentionDenormalized
import org.trinityprayer.models.UserSummary

@Service
class PrayerIntentionsService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val churchService: ChurchService,
) {

    fun getPrayerIntentions(): List<PrayerIntention> {
        return namedParameterJdbcTemplate
            .query(
                """
                SELECT
                    id, created_at, creator_id, intention_text, answerer_id, `read`, answered_at
                FROM
                    public.prayer_intentions
                WHERE
                    answerer_id is null AND creator_id != :creator_id
                """.trimIndent(), emptyMap<String, Any>()
            ) { rs, _ ->
                PrayerIntention(
                    id = rs.getLong("id"),
                    intentionText = rs.getString("intention_text"),
                    read = rs.getBoolean("read"),
                    answeredAt = rs.getTimestamp("answered_at")?.toInstant(),
                    answererId = rs.getString("answerer_id"),
                    createdAt = rs.getTimestamp("created_at").toInstant(),
                    creatorId = rs.getString("creator_id"),
                )
            }
    }

    fun getPrayerIntention(prayerIntentionId: Long): PrayerIntentionDenormalized {
        val ret = namedParameterJdbcTemplate.queryForObject(
            """
            SELECT 
                pi.id, 
                pi.created_at, 
                pi.creator_id,
                c.raw_user_meta_data->>'first_name' as creator_first_name, 
                pi.intention_text, 
                pi.answerer_id,
                a.raw_user_meta_data->>'first_name' as answerer_first_name, 
                pi.`read`, 
                pi.answered_at
            FROM 
                public.prayer_intentions pi 
            JOIN auth.users c ON c.id = pi.creator_id 
            LEFT OUTER JOIN auth.users a ON pi.answerer_id = a.id
            WHERE 
                pi.id = :prayer_intention_id
                AND pi.creator_id = :creator_id
            """.trimIndent(),
            MapSqlParameterSource()
                .addValue("prayer_intention_id", prayerIntentionId)
        ) { rs, _ ->
            val answererId = rs.getString("answerer_id")
            PrayerIntentionDenormalized(
                id = rs.getLong("id"),
                intentionText = rs.getString("intention_text"),
                createdAt = rs.getTimestamp("created_at").toInstant(),
                answeredAt = rs.getTimestamp("answered_at")?.toInstant(),
                read = rs.getBoolean("read"),
                answerer = UserSummary(
                    id = answererId,
                    firstName = rs.getString("answerer_first_name"),
                    church = churchService.getChurchForUser(answererId)
                ),
                creator = UserSummary(
                    id = rs.getString("creator_id"),
                    firstName = rs.getString("creator_first_name"),
                )
            )
        }

        if (ret == null) {
            throw Exception("Prayer Intention Not Found")
        }
        return ret
    }

}