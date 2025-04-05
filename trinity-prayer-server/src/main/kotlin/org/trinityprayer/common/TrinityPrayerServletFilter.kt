package org.trinityprayer.common

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class TrinityPrayerServletFilter(
    private val jwtValidator: JwtValidator,
    private val userProvider: UserProvider,
) : OncePerRequestFilter() {

    private val log = LoggerFactory.getLogger(this.javaClass)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        log.info("Processing ${request.method} ${request.requestURI}")
        val authHeader = request.getHeader("Authorization")
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                val token = authHeader.substring(7)
                val jwt = jwtValidator.validate(token)
                userProvider.setUser(jwt.token)
            } catch (ex: Exception) {
                response.status = HttpServletResponse.SC_UNAUTHORIZED
                log.info("Failed to validate token message=${ex.message}", ex)
                return
            }
        } else if (allowWithoutAccessToken(request)) {
            log.info("Allowing call to ${request.requestURI} without token")
        } else {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            log.info("No token found for ${request.method} ${request.requestURI}")
            return
        }

        try {
            filterChain.doFilter(request, response)
        } finally {
            userProvider.clearUser()
            log.info("Finished processing ${request.method} ${request.requestURI}")
        }
    }

    private fun allowWithoutAccessToken(request: HttpServletRequest): Boolean {
        val isGetChurches = request.requestURI.startsWith("/api/v1/churches") && request.method == "GET"
        val isGetApiDocs = request.requestURI.startsWith("/v3/api-docs") && request.method == "GET"
        return isGetChurches || isGetApiDocs
    }

}