package org.trinityprayer.services

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.core.namedparam.set
import org.springframework.stereotype.Service
import org.trinityprayer.models.Church

@Service
class ChurchService(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate
) {

    fun getChurches(searchTerm: String? = null): List<Church> {
        val parameterSource = MapSqlParameterSource()
        if (searchTerm != null) {
            parameterSource["search_term"] = "%${searchTerm.lowercase()}$"
        } else {
            parameterSource["search_term"] = "%%"
        }
        return namedParameterJdbcTemplate.query(
            """
            SELECT
                id, created_at, name, google_place_id, latitude, longitude
            FROM
                public.churches
            WHERE
                lower(name) like :search_term
            """.trimIndent(),
            parameterSource
        ) {
            rs, _ ->
                Church(
                    id = rs.getLong("id"),
                    name = rs.getString("name"),
                    googlePlaceId = rs.getString("google_place_id"),
                    latitude = rs.getDouble("latitude"),
                    longitude = rs.getDouble("longitude"),
                    createdAt = rs.getTimestamp("created_at").toInstant(),
                )
        }
    }

}