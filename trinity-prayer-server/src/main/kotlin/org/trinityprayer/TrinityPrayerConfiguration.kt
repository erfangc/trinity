package org.trinityprayer

import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.trinityprayer.common.Environment.SUPABASE_POSTGRES_PASSWORD
import javax.sql.DataSource

@Configuration
class TrinityPrayerConfiguration {
    @Bean
    fun dataSource(): DataSource {
        return DataSourceBuilder
            .create()
            .driverClassName("org.postgresql.Driver")
            .url("jdbc:postgresql://db.dxbepeosafgqworcuycz.supabase.co:5432/postgres")
            .username("postgres")
            .password(SUPABASE_POSTGRES_PASSWORD)
            .build()
    }

    @Bean
    fun jdbcTemplate(dataSource: DataSource) = JdbcTemplate(dataSource)

    @Bean
    fun namedParameterJdbcTemplate(dataSource: DataSource) = NamedParameterJdbcTemplate(dataSource)
}