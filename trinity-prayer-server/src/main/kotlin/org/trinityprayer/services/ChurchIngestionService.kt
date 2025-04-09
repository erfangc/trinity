package org.trinityprayer.services

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

import org.springframework.stereotype.Service
import org.trinityprayer.models.PlaceResult
import org.trinityprayer.models.PlacesResponse

@Service
class ChurchIngestionService(
    private val objectMapper: ObjectMapper,
    private val jdbcTemplate: NamedParameterJdbcTemplate,
) {
    private val apiKey: String = System.getenv("GOOGLE_API_KEY") ?: ""

    private val baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    private val httpClient = HttpClient.newHttpClient()
    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    fun ingestChurches(lat: Double, lng: Double) {
        var pageToken: String? = null
        var page = 1

        do {
            val url = buildUrl(lat, lng, pageToken)
            val httpRequest = HttpRequest.newBuilder().uri(URI.create(url)).GET().build()
            log.info("Fetching churches from $url")
            val response = httpClient.send(
                httpRequest,
                HttpResponse.BodyHandlers.ofString()
            )
            log.info("Fetched churches from $url statusCode=${response.statusCode()}")

            if (response.statusCode() != 200) {
                throw RuntimeException("Failed to fetch churches: ${response.body()}")
            }

            val placesResponse = objectMapper.readValue(response.body(), PlacesResponse::class.java)
            insertChurches(placesResponse.results)

            pageToken = placesResponse.nextPageToken
            if (pageToken != null) {
                // Wait required by Google before next_page_token becomes valid
                Thread.sleep(2000)
            }

            page++

        } while (pageToken != null && page <= 3)
    }

    private fun buildUrl(lat: Double, lng: Double, pageToken: String?): String {
        return if (pageToken != null) {
            "$baseUrl?pagetoken=$pageToken&key=$apiKey"
        } else {
            "$baseUrl?location=$lat,$lng&radius=50000&keyword=catholic&type=church&key=$apiKey"
        }
    }

    private fun insertChurches(results: List<PlaceResult>) {
        val sql = """
            INSERT INTO public.churches (name, google_place_id, latitude, longitude, vicinity) 
            VALUES (:name, :place_id, :lat, :lng, :vicinity)
            ON CONFLICT (google_place_id) DO NOTHING
        """.trimIndent()

        results.forEach { result ->
            val params = MapSqlParameterSource()
                .addValue("name", result.name)
                .addValue("place_id", result.placeId)
                .addValue("lat", result.geometry.location.lat)
                .addValue("lng", result.geometry.location.lng)
                .addValue("vicinity", result.vicinity)

            jdbcTemplate.update(sql, params)
        }

        log.info("Inserted ${results.size} churches from current page.")
    }

}