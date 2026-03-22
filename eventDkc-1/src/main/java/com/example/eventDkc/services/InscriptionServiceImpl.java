package com.example.eventDkc.services;

import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventDkc.entities.User;

import com.example.eventDkc.dto.InscriptionDto;
import com.example.eventDkc.entities.Inscription;
import com.example.eventDkc.repositories.EvenementRepository;
import com.example.eventDkc.repositories.InscriptionRepository;
import com.example.eventDkc.repositories.UserRepository;

@Service
public class InscriptionServiceImpl implements InscriptionService {
	
	@Autowired
	InscriptionRepository inscriptionRepository ;

	@Autowired
	UserRepository userRepository ;

	@Autowired
	EvenementRepository evenementRepository ;

	@Override
	@Transactional
	public InscriptionDto saveInscriptionForCurrentUser(InscriptionDto dto, String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
		if (dto.getEvenementId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "evenementId est requis");
		}
		if (!evenementRepository.existsById(dto.getEvenementId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Événement introuvable");
		}
		if (inscriptionRepository.existsByUser_IdAndEvenement_Id(user.getId(), dto.getEvenementId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous êtes déjà inscrit à cet événement");
		}
		if (dto.getNom() == null || dto.getNom().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom est requis");
		}
		if (dto.getPrenom() == null || dto.getPrenom().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le prénom est requis");
		}
		if (dto.getMail() == null || dto.getMail().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email est requis");
		}
		dto.setUtilisateurId(user.getId());
		if (dto.getDateInscription() == null) {
			dto.setDateInscription(LocalDateTime.now());
		}
		dto.setStatut(true);
		return saveInscription(dto);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean isRegisteredForEvent(String username, Long evenementId) {
		if (evenementId == null) {
			return false;
		}
		return userRepository.findByUsername(username)
				.map(u -> inscriptionRepository.existsByUser_IdAndEvenement_Id(u.getId(), evenementId))
				.orElse(false);
	}

	@Override
	@Transactional
	public void deleteInscriptionForCurrentUser(String username, Long evenementId) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
		if (!evenementRepository.existsById(evenementId)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Événement introuvable");
		}
		if (!inscriptionRepository.existsByUser_IdAndEvenement_Id(user.getId(), evenementId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vous n'êtes pas inscrit à cet événement");
		}
		inscriptionRepository.deleteByUser_IdAndEvenement_Id(user.getId(), evenementId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<InscriptionDto> getInscriptionsForCurrentUser(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
		return inscriptionRepository.findByUser_IdWithEvenement(user.getId()).stream()
				.map(this::convertEntityToDto)
				.collect(Collectors.toList());
	}

	@Override
	public InscriptionDto saveInscription(InscriptionDto inscription) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(inscriptionRepository.save(this.convertDtoToEntity(inscription)));
	}

	@Override
	public InscriptionDto updateInscription(InscriptionDto inscription) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(inscriptionRepository.save(this.convertDtoToEntity(inscription)));
	}

	@Override
	public void deleteInscription(InscriptionDto inscription) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteInscriptionById(Long id) {
		// TODO Auto-generated method stub
		inscriptionRepository.deleteById(id);
	}

	@Override
	public InscriptionDto getInscription(Long id) {
		// TODO Auto-generated method stub
		return convertEntityToDto(inscriptionRepository.findById(id).get());
	}

	@Override
	public List<InscriptionDto> getAllInscription() {
		// TODO Auto-generated method stub
		return inscriptionRepository.findAll().stream()
				.map(this::convertEntityToDto)
				.collect(Collectors.toList());
	}

	@Override
	public InscriptionDto convertEntityToDto(Inscription inscription) {
		InscriptionDto inscriptionDto = new InscriptionDto();
		inscriptionDto.setId(inscription.getId());
		inscriptionDto.setNom(inscription.getNom());
		inscriptionDto.setPrenom(inscription.getPrenom());
		inscriptionDto.setMail(inscription.getMail());
		inscriptionDto.setDateInscription(inscription.getDateInscription());
		inscriptionDto.setDateAnnulation(inscription.getDateAnnulation());
		inscriptionDto.setStatut(inscription.isStatut());
		if (inscription.getUser() != null) {
			inscriptionDto.setUtilisateurId(inscription.getUser().getId());
		}
		if (inscription.getEvenement() != null) {
			inscriptionDto.setEvenementId(inscription.getEvenement().getId());
			inscriptionDto.setEvenementNom(inscription.getEvenement().getNomEvenement());
		}
		return inscriptionDto;
	}

	@Override
	public Inscription convertDtoToEntity(InscriptionDto inscriptionDto) {
		Inscription inscription = new Inscription();
		inscription.setNom(inscriptionDto.getNom());
		inscription.setPrenom(inscriptionDto.getPrenom());
		inscription.setMail(inscriptionDto.getMail());
		inscription.setDateInscription(inscriptionDto.getDateInscription());
		inscription.setDateAnnulation(inscriptionDto.getDateAnnulation());
		inscription.setStatut(inscriptionDto.isStatut());
		Long userId = inscriptionDto.getUtilisateurId() != null ? inscriptionDto.getUtilisateurId() : (inscriptionDto.getUserDto() != null && inscriptionDto.getUserDto().getId() != null ? inscriptionDto.getUserDto().getId() : null);
		if (userId != null) {
			userRepository.findById(userId).ifPresent(u -> {
				inscription.setUser(u);
				if (inscription.getNom() == null || inscription.getNom().isBlank()) inscription.setNom(u.getNom());
				if (inscription.getPrenom() == null || inscription.getPrenom().isBlank()) inscription.setPrenom(u.getPrenom());
				if (inscription.getMail() == null || inscription.getMail().isBlank()) inscription.setMail(u.getEmail());
			});
		}
		if (inscriptionDto.getEvenementId() != null) {
			evenementRepository.findById(inscriptionDto.getEvenementId()).ifPresent(inscription::setEvenement);
		}
		return inscription;
	}

}
