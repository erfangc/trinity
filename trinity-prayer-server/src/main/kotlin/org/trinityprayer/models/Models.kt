package org.trinityprayer.models

import java.time.Instant

data class PrayerIntention(
    val id: Long? = null,
    val createdAt: Instant = Instant.now(),
    val creatorId: String? = null, // Map uuid to String
    val intentionText: String? = null,
    val answererId: String? = null, // Map uuid to String
    val read: Boolean = false,
    val answeredAt: Instant? = null,
)

data class UserSummary(
    val id: String,
    val firstName: String,
    val lastName: String? = null,
    val church: Church? = null,
)

data class Church(
    val id: Long? = null,
    val createdAt: Instant = Instant.now(),
    val name: String? = null,
    val googlePlaceId: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
)

data class PrayerIntentionDenormalized(
    val id: Long? = null,
    val createdAt: Instant = Instant.now(),
    val creatorId: String? = null,
    val creator: UserSummary? = null,
    val intentionText: String? = null,
    val answererId: String? = null,
    val answerer: UserSummary? = null,
    val read: Boolean = false,
    val answeredAt: Instant? = null,
)

data class CreatePrayerIntentionRequest(
    val intentText: String,
)