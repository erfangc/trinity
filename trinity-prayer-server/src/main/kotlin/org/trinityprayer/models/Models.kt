package org.trinityprayer.models

import java.time.Instant

data class PrayerIntention(
    val id: Long? = null,
    val createdAt: Instant? = null,
    val creatorId: String? = null,
    val intentionText: String? = null,
    val answererId: String? = null,
    val isRead: Boolean = false,
    val answeredAt: Instant? = null,
)

data class UserSummary(
    val id: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val church: Church? = null,
)

data class Church(
    val id: Long? = null,
    val createdAt: Instant? = null,
    val name: String? = null,
    val googlePlaceId: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
)

data class PrayerIntentionDenormalized(
    val id: Long? = null,
    val createdAt: Instant? = null,
    val creatorId: String? = null,
    val creator: UserSummary? = null,
    val intentionText: String? = null,
    val answererId: String? = null,
    val answerer: UserSummary? = null,
    val isRead: Boolean = false,
    val answeredAt: Instant? = null,
)

data class CreatePrayerIntentionRequest(
    val intentText: String,
)

data class ExpoNotificationPayload(
    val to: String,
    val title: String,
    val body: String,
    val data: Map<String, String>? = null,
)