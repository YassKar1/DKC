package com.example.eventDkc.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventDkc.dto.InscriptionDto;
import com.example.eventDkc.services.InscriptionService;

@RestController
@RequestMapping("/api/inscription")
@CrossOrigin
public class InscriptionRESTController {
	@Autowired
	InscriptionService inscriptionService;

	/** Toutes les inscriptions de l'utilisateur connecté (avec nom d'événement). */
	@GetMapping("/me")
	public List<InscriptionDto> getMyInscriptions(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise");
		}
		return inscriptionService.getInscriptionsForCurrentUser(principal.getName());
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public List<InscriptionDto> getAllInscription() {
		return inscriptionService.getAllInscription();
	}
	
	@RequestMapping(value="/{id}",method = RequestMethod.GET) 
	public InscriptionDto getInscriptionById(@PathVariable("id") Long id) { 
		return inscriptionService.getInscription(id); 
		} 
	
	@RequestMapping(method = RequestMethod.POST) 
	public InscriptionDto createInscription(@RequestBody InscriptionDto inscription, Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise pour s'inscrire");
		}
		return inscriptionService.saveInscriptionForCurrentUser(inscription, principal.getName());
	}

	/** Indique si l'utilisateur connecté est déjà inscrit à cet événement. */
	@GetMapping("/me/evenement/{evenementId}/registered")
	public Map<String, Boolean> isRegisteredForEvent(@PathVariable Long evenementId, Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise");
		}
		return Map.of("registered", inscriptionService.isRegisteredForEvent(principal.getName(), evenementId));
	}

	/** Désinscription de l'événement pour l'utilisateur connecté. */
	@DeleteMapping("/me/evenement/{evenementId}")
	public void deleteMyInscription(@PathVariable Long evenementId, Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise");
		}
		inscriptionService.deleteInscriptionForCurrentUser(principal.getName(), evenementId);
	}
	
	@RequestMapping(method = RequestMethod.PUT) 
	public InscriptionDto updateInscription(@RequestBody InscriptionDto inscription) { 
		return inscriptionService.updateInscription(inscription); 
		}
	
	@RequestMapping(value="/{id}",method = RequestMethod.DELETE) 
	public void deleteInscription(@PathVariable("id") Long id) { 
	inscriptionService.deleteInscriptionById(id); 
	}
	

}
