package org.trinityprayer.controllers

import org.springframework.web.bind.annotation.*
import org.trinityprayer.common.UserProvider
import org.trinityprayer.models.Church
import org.trinityprayer.models.CreatePrayerIntentionRequest
import org.trinityprayer.models.PrayerIntention
import org.trinityprayer.models.PrayerIntentionDenormalized
import org.trinityprayer.services.*

@RestController
@RequestMapping("/api/v1")
class TrinityPrayerController(
    private val prayerIntentionCreator: PrayerIntentionCreator,
    private val prayerIntentionsService: PrayerIntentionsService,
    private val answerPrayerIntentionService: AnswerPrayerIntentionService,
    private val churchService: ChurchService,
    private val churchIngestionService: ChurchIngestionService,
    private val userProvider: UserProvider,
) {

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
    fun getChurches(@RequestParam(required = false) searchTerm: String? = null): List<Church> {
        return churchService.getChurches(searchTerm = searchTerm)
    }

    @GetMapping("churches/{churchId}")
    fun getChurch(@PathVariable churchId: Long): Church {
        return churchService.getChurch(churchId = churchId)
    }

    @PostMapping("churches")
    fun ingestChurches(@RequestParam lat: Double, @RequestParam lng: Double) {
        val user = userProvider.getUser() ?: throw IllegalStateException("User not logged in")
        if (user.sub == "root") {
            return churchIngestionService.ingestChurches(lat = lat, lng = lng)
        } else {
            throw IllegalStateException("User is not root")
        }
    }
}