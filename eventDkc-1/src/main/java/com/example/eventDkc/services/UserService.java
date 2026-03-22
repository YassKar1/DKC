package com.example.eventDkc.services;

import java.util.List;

import com.example.eventDkc.dto.UserDto;
import com.example.eventDkc.entities.User;
import com.example.eventDkc.register.RegistrationRequest;



public interface UserService {
	
	UserDto saveUser(UserDto user); 
	UserDto updateUser(UserDto user); 
	void deleteUser(UserDto user); 
	void deleteUserById(Long id); 
	UserDto getUser(Long id); 
	List<UserDto> getAllUser();
	UserDto convertEntityToDto (User user);
	User convertDtoToEntity(UserDto userDto);
	User registerUser(RegistrationRequest request);
	User findUserByUsername(String username);

	/** Profil (sans mot de passe) pour l'utilisateur connecté. */
	UserDto getUserProfileByUsername(String username);

}
