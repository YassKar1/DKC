package com.example.eventDkc.services;

import java.util.List;

import com.example.eventDkc.dto.InscriptionDto;
import com.example.eventDkc.entities.Inscription;



public interface InscriptionService {
	
	/** Enregistre une inscription pour l'utilisateur connecté (utilisateurId imposé côté serveur). */
	InscriptionDto saveInscriptionForCurrentUser(InscriptionDto inscription, String username);

	boolean isRegisteredForEvent(String username, Long evenementId);

	void deleteInscriptionForCurrentUser(String username, Long evenementId);

	List<InscriptionDto> getInscriptionsForCurrentUser(String username);

	InscriptionDto saveInscription(InscriptionDto inscription); 
	InscriptionDto updateInscription(InscriptionDto inscription); 
	void deleteInscription(InscriptionDto inscription); 
	void deleteInscriptionById(Long id); 
	InscriptionDto getInscription(Long id); 
	List<InscriptionDto> getAllInscription();
	InscriptionDto convertEntityToDto (Inscription inscription);
	Inscription convertDtoToEntity(InscriptionDto inscriptionDto);

}
