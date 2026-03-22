package com.example.eventDkc.services;

import java.util.List;

import com.example.eventDkc.dto.EvenementDto;
import com.example.eventDkc.entities.Evenement;


public interface EvenementService {
	
	EvenementDto saveEvenement(EvenementDto evenement); 
	EvenementDto updateEvenement(EvenementDto evenement); 
	void deleteEvenement(EvenementDto evenement); 
	void deleteEvenementById(Long id); 
	EvenementDto getEvenement(Long id); 
	List<EvenementDto> getAllEvenement();
	EvenementDto convertEntityToDto (Evenement evenement);
	Evenement convertDtoToEntity(EvenementDto evenementDto);
	
}
