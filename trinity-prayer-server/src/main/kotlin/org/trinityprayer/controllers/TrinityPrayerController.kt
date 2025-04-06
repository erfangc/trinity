package org.trinityprayer.controllers

import org.springframework.web.bind.annotation.*
import org.trinityprayer.models.Church
import org.trinityprayer.models.CreatePrayerIntentionRequest
import org.trinityprayer.models.PrayerIntention
import org.trinityprayer.models.PrayerIntentionDenormalized
import org.trinityprayer.services.*

@RestController
@RequestMapping("/api/v1")
class TrinityPrayerController(
    private val expoPushTokenService: ExpoPushTokenService,
    private val prayerIntentionCreator: PrayerIntentionCreator,
    private val prayerIntentionsService: PrayerIntentionsService,
    private val answerPrayerIntentionService: AnswerPrayerIntentionService,
    private val churchService: ChurchService,
) {

    @PutMapping("expo-push-tokens")
    fun saveExpoToken(@RequestParam expoPushToken: String) {
        expoPushTokenService.addPushToken(expoPushToken)
    }

    @GetMapping("prayer-intentions")
    fun getPrayerIntentions(): List<PrayerIntentionDenormalized> {
        return prayerIntentionsService.getUnansweredPrayerIntentions()
    }

    @GetMapping("my-prayer-intentions")
    fun getMyPrayerIntentions(): List<PrayerIntentionDenormalized> {
        return prayerIntentionsService.getMyPrayerIntentions()
    }

    @PutMapping("prayer-intentions/{prayerIntentionId}/answer")
    fun answerPrayer(@PathVariable prayerIntentionId: Long) {
        return answerPrayerIntentionService.answerPrayerIntention(prayerIntentionId)
    }

    @PostMapping("prayer-intentions")
    fun createPrayerIntention(@RequestBody request: CreatePrayerIntentionRequest): PrayerIntention {
        return prayerIntentionCreator.createPrayerIntention(request)
    }

    @GetMapping("prayer-intentions/{prayerIntentionId}")
    fun getPrayerIntention(@PathVariable prayerIntentionId: Long): PrayerIntentionDenormalized {
        return prayerIntentionsService.getPrayerIntention(prayerIntentionId)
    }

    @GetMapping("churches")
    fun getChurches(): List<Church> {
        return churchService.getChurches()
    }

}