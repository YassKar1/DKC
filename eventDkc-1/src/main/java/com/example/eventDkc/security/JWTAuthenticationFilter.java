package com.example.eventDkc.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.boot.json.JsonParseException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.eventDkc.entities.User;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
	
	private AuthenticationManager authenticationManager ;
	
	public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
		super();
		this.authenticationManager = authenticationManager;
		
		setFilterProcessesUrl("/api/auth/login");
	}
	
	@Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        // User user = null;
		User user = new User();

        try {
            /* user = new ObjectMapper().readValue(request.getInputStream(),
                    User.class);
            
            JsonNode node = new ObjectMapper().readTree(request.getInputStream());
            String username = node.hasNonNull("username") 
                    ? node.get("username").asText() 
                    : node.path("nom").asText();

            String password = node.hasNonNull("password") 
                    ? node.get("password").asText()
                    : node.path("motDePasse").asText(); */
        	ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(request.getInputStream());

            String username = node.get("username").asText();
            String password = node.get("password").asText();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, password);

            return authenticationManager.authenticate(authToken);
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
	}

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult)
            throws IOException, ServletException {

        org.springframework.security.core.userdetails.User springUser =
                (org.springframework.security.core.userdetails.User) authResult.getPrincipal();

        List<String> roles = new ArrayList<>();
        springUser.getAuthorities().forEach(au -> {
            roles.add(au.getAuthority());
        });

        String jwt = JWT.create()
                .withSubject(springUser.getUsername())
                .withArrayClaim("roles", roles.toArray(new String[roles.size()]))
                .withExpiresAt(new Date(System.currentTimeMillis() + 10 * 24 * 60 * 60 * 1000))
                .sign(Algorithm.HMAC256(SecParams.SECRET));

        response.addHeader("Authorization", SecParams.PREFIX + jwt);
        response.setContentType("application/json");
        response.getWriter().write("{\"token\":\"" + jwt + "\"}");
    }
}
