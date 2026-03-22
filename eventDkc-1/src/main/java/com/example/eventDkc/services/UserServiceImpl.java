package com.example.eventDkc.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventDkc.dto.RoleDto;
import com.example.eventDkc.dto.UserDto;
import com.example.eventDkc.entities.Role;
import com.example.eventDkc.entities.User;
import com.example.eventDkc.exception.EmailAlreadyExistsException;
import com.example.eventDkc.register.RegistrationRequest;
import com.example.eventDkc.repositories.EvenementRepository;
import com.example.eventDkc.repositories.InscriptionRepository;
import com.example.eventDkc.repositories.RoleRepository;
import com.example.eventDkc.repositories.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	ModelMapper modelMapper ;
	
	@Autowired
	UserRepository userRepository ;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder ;
	
	@Autowired 
	private RoleRepository roleRepository;

	@Autowired
	private InscriptionRepository inscriptionRepository;

	@Autowired
	private EvenementRepository evenementRepository;

	@Override
	public UserDto saveUser(UserDto user) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(userRepository.save(this.convertDtoToEntity(user)));
	}

	@Override
	public UserDto updateUser(UserDto user) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(userRepository.save(this.convertDtoToEntity(user)));
	}

	@Override
	public void deleteUser(UserDto user) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void deleteUserById(Long id) {
		if (!userRepository.existsById(id)) {
			return;
		}
		// Ordre : inscriptions liées aux événements du user → inscriptions où il est inscrit → événements → user
		inscriptionRepository.deleteInscriptionsForEventsCreatedBy(id);
		inscriptionRepository.deleteInscriptionsForUserRegistrations(id);
		evenementRepository.deleteEvenementsByUserId(id);
		userRepository.deleteById(id);
	}

	@Override
	public UserDto getUser(Long id) {
		// TODO Auto-generated method stub
		return convertEntityToDto(userRepository.findById(id).get());
	}

	@Override
	public List<UserDto> getAllUser() {
		// TODO Auto-generated method stub
		return userRepository.findAll().stream()
				.map(this::convertEntityToDto)
				.collect(Collectors.toList());
	}

	@Override
	public UserDto convertEntityToDto(User user) {
		UserDto userDto = modelMapper.map(user, UserDto.class);
		userDto.setUsername(user.getUsername());
		// ModelMapper ne relie pas toujours user.role → roleDto (noms différents)
		if (user.getRole() != null) {
			userDto.setRoleDto(modelMapper.map(user.getRole(), RoleDto.class));
		} else {
			userDto.setRoleDto(null);
		}
		return userDto;
	}

	@Override
	public User convertDtoToEntity(UserDto userDto) {
		// TODO Auto-generated method stub
		User user = new User();
		user = modelMapper.map(userDto, User.class);
		return user;
	}

	@Override
	public User registerUser(RegistrationRequest request) {
		Optional<User> optionaluser;
		try {
			optionaluser = userRepository.findByEmail(request.getEmail());
		} catch (IncorrectResultSizeDataAccessException ex) {
			// Plusieurs utilisateurs avec le même email : on considère que l'email est déjà utilisé
			throw new EmailAlreadyExistsException("Email déjà existant !");
		}
		if (optionaluser.isPresent()) {
			throw new EmailAlreadyExistsException("Email déjà existant !");
		}
				
		User newUser = new User();
		newUser.setUsername(request.getUsername());
		newUser.setEmail(request.getEmail());
		newUser.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
		newUser.setNom(request.getNom());
		newUser.setPrenom(request.getPrenom());
		newUser.setTelephone(request.getTelephone());
		Role roleUser = roleRepository.findByNomRole("USER");
		newUser.setRole(roleUser);
		return userRepository.save(newUser);
	}

	@Override
	public User findUserByUsername(String username) {
		return userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
	}

	@Override
	@Transactional(readOnly = true)
	public UserDto getUserProfileByUsername(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
		UserDto dto = convertEntityToDto(user);
		dto.setMdp(null);
		return dto;
	}
}