package org.trinityprayer.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class PlacesResponse(
    val results: List<PlaceResult>,
    @JsonProperty("next_page_token")
    val nextPageToken: String? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class PlaceResult(
    val name: String,
    @JsonProperty("place_id")
    val placeId: String,
    val geometry: Geometry,
    val vicinity: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Geometry(val location: Location)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Location(val lat: Double, val lng: Double)