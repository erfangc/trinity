package org.trinityprayer.services

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.trinityprayer.common.UserProvider
import org.trinityprayer.models.Church
import org.trinityprayer.models.PrayerIntentionDenormalized
import org.trinityprayer.models.UserSummary
import java.sql.ResultSet
import java.sql.Timestamp
import java.util.*

/**
 * Service class for handling operations related to prayer intentions.
 *
 * This service interacts with the `prayer_intentions` table in the database to retrieve,
 * process, and return prayer intentions, supporting functionality for both users and system operations.
 *
 * @property namedParameterJdbcTemplate Used to execute parameterized queries against the database.
 * @property churchService Service for retrieving church-related information.
 */
@Service
class PrayerIntentionsService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    private val churchService: ChurchService,
    private val userProvider: UserProvider,
) {

    fun getUnansweredPrayerIntentions(): List<PrayerIntentionDenormalized> {
        val sub = userProvider.getUser()?.sub?.let { UUID.fromString(it) } ?: throw IllegalStateException("User not logged in")
        return namedParameterJdbcTemplate
            .query(
                """
                SELECT
                    pi.id,
                    pi.created_at,
                    creator_id,
                    c.raw_user_meta_data->>'first_name' as creator_first_name,
                    c.raw_user_meta_data->>'last_name' as creator_last_name,
                    ch.id as church_id,
                    ch.name as church_name,
                    ch.google_place_id,
                    ch.latitude,
                    ch.longitude,
                    intention_text,
                    answerer_id,
                    is_read,
                    answered_at
                FROM
                    public.prayer_intentions pi
                JOIN
                    auth.users c ON pi.creator_id = c.id
                LEFT JOIN
                    churches ch
                    ON (c.raw_user_meta_data->>'church_id')::bigint = ch.id
                WHERE
                    answerer_id is null AND creator_id != :creator_id
                """.trimIndent(),
                MapSqlParameterSource()
                    .addValue("creator_id", sub)
            ) { rs, _ ->
                PrayerIntentionDenormalized(
                    id = rs.getLong("id"),
                    intentionText = rs.getString("intention_text"),
                    isRead = rs.getBoolean("is_read"),
                    answeredAt = rs.getNullableTimestamp("answered_at")?.toInstant(),
                    answererId = rs.getNullableString("answerer_id"),
                    createdAt = rs.getNullableTimestamp("created_at")?.toInstant(),
                    creatorId = rs.getNullableString("creator_id"),
                    creator = UserSummary(
                        id = rs.getNullableString("creator_id"),
                        firstName = rs.getNullableString("creator_first_name"),
                        lastName = rs.getNullableString("creator_last_name"),
                        church = Church(
                            id = rs.getNullableLong("church_id"),
                            name = rs.getNullableString("church_name"),
                            googlePlaceId = rs.getNullableString("google_place_id"),
                            latitude = rs.getNullableDouble("latitude"),
                            longitude = rs.getNullableDouble("longitude"),
                        )
                    )
                )
            }
    }

    /**
     * Extension method to safely get a nullable String from the ResultSet.
     *
     * @receiver ResultSet The current set of results from a database query.
     * @param columnName The name of the column containing the desired value.
     * @return The String value if not null, otherwise null.
     */
    fun ResultSet.getNullableString(columnName: String): String? {
        return this.getString(columnName)?.takeIf { !this.wasNull() }
    }

    /**
     * Extension method to safely get a nullable Double from the ResultSet.
     *
     * @receiver ResultSet The current set of results from a database query.
     * @param columnName The name of the column containing the desired value.
     * @return The Double value if not null, otherwise null.
     */
    fun ResultSet.getNullableDouble(columnName: String): Double? {
        val value = this.getDouble(columnName)
        return if (this.wasNull()) null else value
    }

    /**
     * Extension method to safely get a nullable Long from the ResultSet.
     *
     * @receiver ResultSet The current set of results from a database query.
     * @param columnName The name of the column containing the desired value.
     * @return The Long value if not null, otherwise null.
     */
    fun ResultSet.getNullableLong(columnName: String): Long? {
        val value = this.getLong(columnName)
        return if (this.wasNull()) null else value
    }

    /**
     * Extension method to safely get a nullable Timestamp from the ResultSet.
     *
     * @receiver ResultSet The current set of results from a database query.
     * @param columnName The name of the column containing the desired value.
     * @return The Timestamp value if not null, otherwise null.
     */
    fun ResultSet.getNullableTimestamp(columnName: String): Timestamp? {
        return this.getTimestamp(columnName)?.takeIf { !this.wasNull() }
    }

    fun getPrayerIntention(prayerIntentionId: Long): PrayerIntentionDenormalized {
        val ret = namedParameterJdbcTemplate.queryForObject(
            """
            SELECT pi.id,
                   pi.created_at,
                   pi.creator_id,
                   c.raw_user_meta_data ->> 'first_name' as creator_first_name,
                   cch.name                              as creator_church_name,
                   cch.id                                as creator_church_id,
                   pi.intention_text,
                   pi.answerer_id,
                   a.raw_user_meta_data ->> 'first_name' as answerer_first_name,
                   ach.name                              as answerer_church_name,
                   ach.id                                as answerer_church_id,
                   pi.is_read,
                   pi.answered_at
            FROM public.prayer_intentions pi
                     JOIN
                 auth.users c ON c.id = pi.creator_id
                     LEFT JOIN
                 auth.users a ON pi.answerer_id = a.id
                     LEFT JOIN
                 churches ach ON (a.raw_user_meta_data ->> 'church_id')::bigint = ach.id
                     LEFT JOIN
                 churches cch ON (a.raw_user_meta_data ->> 'church_id')::bigint = cch.id
            WHERE pi.id = :prayer_intention_id
            """.trimIndent(),
            MapSqlParameterSource()
                .addValue("prayer_intention_id", prayerIntentionId)
        ) { rs, _ ->
            PrayerIntentionDenormalized(
                id = rs.getLong("id"),
                intentionText = rs.getString("intention_text"),
                createdAt = rs.getTimestamp("created_at").toInstant(),
                answeredAt = rs.getTimestamp("answered_at")?.toInstant(),
                isRead = rs.getBoolean("is_read"),
                answererId = rs.getString("answerer_id"),
                answerer = UserSummary(
                    id = rs.getString("answerer_id"),
                    firstName = rs.getString("answerer_first_name"),
                    church = Church(
                        id = rs.getLong("answerer_church_id"),
                        name = rs.getString("answerer_church_name"),
                    )
                ),
                creatorId = rs.getString("creator_id"),
                creator = UserSummary(
                    id = rs.getString("creator_id"),
                    firstName = rs.getString("creator_first_name"),
                    church = Church(
                        id = rs.getLong("creator_church_id"),
                        name = rs.getString("creator_church_name"),
                    )
                )
            )
        }

        if (ret == null) {
            throw Exception("Prayer Intention Not Found")
        }
        return ret
    }

    fun getMyPrayerIntentions(): List<PrayerIntentionDenormalized> {
        val userId = userProvider.getUser()?.sub?.let { UUID.fromString(it) }
        return namedParameterJdbcTemplate
            .query(
                """
                SELECT pi.id,
                       pi.created_at,
                       creator_id,
                       intention_text,
                       answerer_id,
                       is_read,
                       answered_at,
                       c.raw_user_meta_data->>'first_name' as creator_first_name,
                       c.raw_user_meta_data->>'last_name' as creator_last_name,
                       ch.name as church_name,
                       ch.id as church_id
                FROM
                    public.prayer_intentions pi
                JOIN
                    auth.users c ON pi.creator_id = c.id
                LEFT JOIN
                    public.churches ch ON (c.raw_user_meta_data->>'church_id')::bigint = ch.id
                WHERE creator_id = :creator_id
                """.trimIndent(),
                MapSqlParameterSource()
                    .addValue("creator_id", userId ?: throw IllegalStateException("User not logged in"))
            ) { rs, _ ->
                PrayerIntentionDenormalized(
                    id = rs.getLong("id"),
                    intentionText = rs.getString("intention_text"),
                    isRead = rs.getBoolean("is_read"),
                    answeredAt = rs.getTimestamp("answered_at")?.toInstant(),
                    answererId = rs.getString("answerer_id"),
                    createdAt = rs.getTimestamp("created_at").toInstant(),
                    creatorId = rs.getString("creator_id"),
                    creator = UserSummary(
                        id = rs.getString("creator_id"),
                        firstName = rs.getString("creator_first_name"),
                        lastName = rs.getString("creator_last_name"),
                        church = Church(
                            id = rs.getLong("church_id"),
                            name = rs.getString("church_name")
                        )
                    )
                )
            }
    }

}

