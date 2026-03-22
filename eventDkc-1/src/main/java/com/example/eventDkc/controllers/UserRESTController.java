package com.example.eventDkc.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventDkc.dto.UserDto;
import com.example.eventDkc.entities.User;
import com.example.eventDkc.register.RegistrationRequest;
import com.example.eventDkc.services.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserRESTController {
	@Autowired
	UserService userService ;

	/** Profil de l'utilisateur connecté (nom, prénom, email, etc. — sans mot de passe). */
	@GetMapping("/me")
	public UserDto getCurrentUserProfile(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise");
		}
		return userService.getUserProfileByUsername(principal.getName());
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public List<UserDto> getAllUser() {
		return userService.getAllUser();
	}
	
	@RequestMapping(value="/{id}",method = RequestMethod.GET) 
	public UserDto getUserById(@PathVariable("id") Long id) { 
		return userService.getUser(id); 
		} 
	
	@RequestMapping(method = RequestMethod.POST) 
	public UserDto createUser(@RequestBody UserDto user) { 
		return userService.saveUser(user); 
		} 
	
	@RequestMapping(method = RequestMethod.PUT) 
	public UserDto updateUser(@RequestBody UserDto user) { 
		return userService.updateUser(user); 
		}
	
	@RequestMapping(value="/{id}",method = RequestMethod.DELETE) 
	public void deleteUser(@PathVariable("id") Long id) { 
	userService.deleteUserById(id); 
	}
	
	@PostMapping("/register")
	public User register(@RequestBody Map<String, Object> body) {
		if (body == null) body = java.util.Collections.emptyMap();
		String username = body.get("username") != null ? body.get("username").toString().trim() : null;
		String password = body.get("password") != null ? body.get("password").toString() : null;
		String email = body.get("email") != null ? body.get("email").toString().trim() : null;
		if (username == null || username.isEmpty())
			throw new IllegalArgumentException("Le nom d'utilisateur est requis");
		if (password == null || password.isEmpty())
			throw new IllegalArgumentException("Le mot de passe est requis");
		if (email == null || email.isEmpty())
			throw new IllegalArgumentException("L'email est requis");
		RegistrationRequest request = new RegistrationRequest();
		request.setNom(body.get("nom") != null ? body.get("nom").toString().trim() : null);
		request.setPrenom(body.get("prenom") != null ? body.get("prenom").toString().trim() : null);
		request.setEmail(email);
		request.setTelephone(body.get("telephone") != null ? body.get("telephone").toString().trim() : null);
		request.setUsername(username);
		request.setPassword(password);
		return userService.registerUser(request);
	}

}
