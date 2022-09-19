package kr.chaeum.kdot.robotcms.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Value("${http.port}")
    private int httpPort;

    @Value("${https.port}")
    private int httpsPort;

    @Override
    public void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf();
        httpSecurity.httpBasic();
        httpSecurity
                .portMapper()
                .http(httpPort)
                .mapsTo(httpsPort);
        httpSecurity
                .requiresChannel()
                .anyRequest()
                .requiresSecure();
        httpSecurity
                .headers()
                .contentTypeOptions();
        httpSecurity
                .headers()
                .cacheControl();
        httpSecurity
                .headers()
                .xssProtection()
                .block(false);
        httpSecurity
                .headers()
                .httpStrictTransportSecurity()
                .includeSubDomains(true)
                .maxAgeInSeconds(31536000);
        httpSecurity
                .headers()
                .frameOptions().sameOrigin();
        httpSecurity
                .headers()
                .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN);
        /*httpSecurity
                .headers()
                .contentSecurityPolicy("script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline';");*/
        httpSecurity
                .cors();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://localhost:8443", "https://127.0.0.1:8443"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
