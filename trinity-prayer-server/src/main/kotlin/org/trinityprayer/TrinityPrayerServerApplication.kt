package org.trinityprayer

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TrinityPrayerServerApplication

fun main(args: Array<String>) {
	runApplication<TrinityPrayerServerApplication>(*args)
}
