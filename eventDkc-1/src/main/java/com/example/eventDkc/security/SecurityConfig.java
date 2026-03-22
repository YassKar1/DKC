package com.example.eventDkc.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		// Web (Vite) + en dev : autoriser l’IP du PC pour Expo sur téléphone (ex: exp://192.168.1.19:8081)
		config.setAllowedOrigins(List.of(
				"http://localhost:5173",
				"http://127.0.0.1:5173",
				"http://localhost:3000",
				"http://127.0.0.1:3000",
				"http://localhost",
				"http://10.0.2.2",           // émulateur Android
				"http://192.168.1.19",       // IP locale de votre machine
				"http://localhost:5174",
				"http://localhost:8081",
				"http://127.0.0.1:8081",
				"http://192.168.1.19:8081",
				"http://192.168.1.19:5173"
		));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	@Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

	@Bean
	public AuthenticationManager
	authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authMgr) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(requests -> requests
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/api/auth/login", "/api/user/register").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/evenement", "/api/evenement/*").permitAll()
						.requestMatchers(HttpMethod.DELETE, "/api/evenement/**").hasAuthority("ROLE_ADMIN")
						.anyRequest().authenticated())
				.addFilterBefore(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
				.addFilter(jwtAuthenticationFilter(authMgr));

		return http.build();
	}
	
	// Ne pas exposer en @Bean pour éviter l'enregistrement automatique comme Filter (AuthenticationManager requis)
    public JWTAuthenticationFilter jwtAuthenticationFilter(AuthenticationManager authMgr) {
        JWTAuthenticationFilter filter = new JWTAuthenticationFilter(authMgr);
        filter.setAuthenticationFailureHandler((request, response, ex) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\":\"Identifiants incorrects\",\"message\":\"Identifiants incorrects\"}");
        });
        return filter;
    }
}