package com.example.eventDkc.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventDkc.dto.EvenementDto;
import com.example.eventDkc.dto.LieuDto;
import com.example.eventDkc.dto.RoleDto;
import com.example.eventDkc.dto.TypeEvenementDto;
import com.example.eventDkc.dto.UserDto;
import com.example.eventDkc.entities.Evenement;
import com.example.eventDkc.entities.Lieu;
import com.example.eventDkc.entities.Role;
import com.example.eventDkc.entities.TypeEvenement;
import com.example.eventDkc.entities.User;
import com.example.eventDkc.repositories.EvenementRepository;
import com.example.eventDkc.repositories.InscriptionRepository;
import com.example.eventDkc.repositories.LieuRepository;
import com.example.eventDkc.repositories.TypeEvenementRepository;
import com.example.eventDkc.repositories.UserRepository;

@Service
public class EvenementServiceImpl implements EvenementService {
	
	@Autowired
	EvenementRepository evenementRepository ;

	@Autowired
	LieuRepository lieuRepository ;

	@Autowired
	TypeEvenementRepository typeEvenementRepository ;

	@Autowired
	UserRepository userRepository ;

	@Autowired
	InscriptionRepository inscriptionRepository;

	@Override
	@Transactional
	public EvenementDto saveEvenement(EvenementDto evenement) {
		Evenement entity = convertDtoToEntity(evenement);
		entity.setUser(getCurrentUser());
		return this.convertEntityToDto(evenementRepository.save(entity));
	}

	@Override
	@Transactional
	public EvenementDto updateEvenement(EvenementDto evenement) {
		return this.convertEntityToDto(evenementRepository.save(this.convertDtoToEntity(evenement)));
	}

	@Override
	public void deleteEvenement(EvenementDto evenement) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void deleteEvenementById(Long id) {
		inscriptionRepository.deleteByEvenement_Id(id);
		evenementRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public EvenementDto getEvenement(Long id) {
		Evenement evenement = evenementRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Événement introuvable"));
		return convertEntityToDto(evenement);
	}

	@Override
	@Transactional(readOnly = true)
	public List<EvenementDto> getAllEvenement() {
		return evenementRepository.findAll().stream()
				.map(this::convertEntityToDto)
				.collect(Collectors.toList());
	}

	/**
	 * Mapping manuel : évite ModelMapper sur l'entité complète (collections {@code inscriptions},
	 * graphe {@code user}) qui provoquait des 500 (LazyInitialization / cycles).
	 */
	@Override
	public EvenementDto convertEntityToDto(Evenement evenement) {
		EvenementDto evenementDto = new EvenementDto();
		evenementDto.setId(evenement.getId());
		evenementDto.setNomEvenement(evenement.getNomEvenement());
		evenementDto.setDescription(evenement.getDescription());
		evenementDto.setDateHeureDebut(evenement.getDateHeureDebut());
		evenementDto.setDateHeureFin(evenement.getDateHeureFin());
		evenementDto.setPrix(evenement.getPrix());
		evenementDto.setPromo(evenement.getPromo());
		evenementDto.setLieuDto(toLieuDto(evenement.getLieu()));
		evenementDto.setTypeEvenementDto(toTypeEvenementDto(evenement.getTypeEvenement()));
		evenementDto.setUserDto(toUserDtoLight(evenement.getUser()));
		if (evenement.getId() != null) {
			evenementDto.setInscriptionCount(inscriptionRepository.countInscriptionsForEvenement(evenement.getId()));
		} else {
			evenementDto.setInscriptionCount(0L);
		}
		return evenementDto;
	}

	private static LieuDto toLieuDto(Lieu lieu) {
		if (lieu == null) {
			return null;
		}
		LieuDto dto = new LieuDto();
		dto.setId(lieu.getId());
		dto.setAdresse(lieu.getAdresse());
		dto.setVille(lieu.getVille());
		dto.setCodePostal(lieu.getCodePostal());
		return dto;
	}

	private static TypeEvenementDto toTypeEvenementDto(TypeEvenement type) {
		if (type == null) {
			return null;
		}
		TypeEvenementDto dto = new TypeEvenementDto();
		dto.setId(type.getId());
		dto.setLibelle(type.getLibelle());
		return dto;
	}

	private static RoleDto toRoleDto(Role role) {
		if (role == null) {
			return null;
		}
		RoleDto dto = new RoleDto();
		dto.setId(role.getId());
		dto.setNomRole(role.getNomRole());
		return dto;
	}

	private UserDto toUserDtoLight(User u) {
		if (u == null) {
			return null;
		}
		UserDto dto = new UserDto();
		dto.setId(u.getId());
		dto.setUsername(u.getUsername());
		dto.setNom(u.getNom());
		dto.setPrenom(u.getPrenom());
		dto.setEmail(u.getEmail());
		dto.setTelephone(u.getTelephone());
		dto.setRoleDto(toRoleDto(u.getRole()));
		return dto;
	}

	@Override
	public Evenement convertDtoToEntity(EvenementDto evenementDto) {
		Evenement evenement = new Evenement();
		evenement.setNomEvenement(evenementDto.getNomEvenement());
		evenement.setDescription(evenementDto.getDescription());
		evenement.setDateHeureDebut(evenementDto.getDateHeureDebut());
		evenement.setDateHeureFin(evenementDto.getDateHeureFin());
		evenement.setLieu(resolveLieu(evenementDto));
		evenement.setTypeEvenement(resolveTypeEvenement(evenementDto));
		evenement.setPrix(evenementDto.getPrix());
		evenement.setPromo(evenementDto.getPromo());
		return evenement;
	}

	private Lieu resolveLieu(EvenementDto dto) {
		if (dto.getLieuDto() == null) return null;
		if (dto.getLieuDto().getId() != null) {
			return lieuRepository.findById(dto.getLieuDto().getId()).orElse(null);
		}
		Lieu lieu = new Lieu();
		lieu.setAdresse(dto.getLieuDto().getAdresse());
		lieu.setVille(dto.getLieuDto().getVille());
		lieu.setCodePostal(dto.getLieuDto().getCodePostal());
		lieu.setNom(dto.getLieuDto().getVille() != null ? dto.getLieuDto().getVille() : "Lieu");
		return lieuRepository.save(lieu);
	}

	private TypeEvenement resolveTypeEvenement(EvenementDto dto) {
		if (dto.getTypeEvenementDto() == null) return null;
		if (dto.getTypeEvenementDto().getId() != null) {
			return typeEvenementRepository.findById(dto.getTypeEvenementDto().getId()).orElse(null);
		}
		String libelle = dto.getTypeEvenementDto().getLibelle();
		if (libelle == null || libelle.isBlank()) return null;
		Optional<TypeEvenement> existing = typeEvenementRepository.findAll().stream()
				.filter(t -> t.getLibelle() != null && libelle.equalsIgnoreCase(t.getLibelle()))
				.findFirst();
		if (existing.isPresent()) return existing.get();
		TypeEvenement type = new TypeEvenement();
		type.setLibelle(libelle);
		return typeEvenementRepository.save(type);
	}

	private User getCurrentUser() {
		try {
			Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if (principal == null) return null;
			String username = principal instanceof String ? (String) principal
					: principal.toString();
			if (username == null || username.isBlank()) return null;
			return userRepository.findByUsername(username).orElse(null);
		} catch (Exception e) {
			return null;
		}
	}
}
