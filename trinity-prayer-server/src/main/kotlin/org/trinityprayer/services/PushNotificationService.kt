package org.trinityprayer.services

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import org.trinityprayer.models.ExpoNotificationPayload
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

@Service
class PushNotificationService(private val objectMapper: ObjectMapper) {

    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)
    private val httpClient = HttpClient.newHttpClient()

    fun sendExpoNotification(notification: ExpoNotificationPayload) {
        try {
            val payloadJson = objectMapper.writeValueAsString(notification) // Convert POJO to JSON
            val request = HttpRequest.newBuilder()
                .uri(URI.create("https://exp.host/--/api/v2/push/send"))
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payloadJson))
                .build()

            log.info("Sending push notification. Payload: $notification")
            val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
            if (response.statusCode() != 200) {
                log.error(
                    "Failed to send push notification. Status code: ${response.statusCode()}, Response body: ${response.body()}"
                )
            } else {
                log.info("Successfully sent push notification. Response: ${response.body()}")
            }
        } catch (e: Exception) {
            log.error("Error sending push notification. Payload: $notification", e)
        }
    }

}