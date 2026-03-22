package com.example.eventDkc.services;

import java.util.List;

import com.example.eventDkc.dto.TypeEvenementDto;
import com.example.eventDkc.entities.TypeEvenement;


public interface TypeEvenementService {
	
	TypeEvenementDto saveTypeEvenement(TypeEvenementDto typeEvenement); 
	TypeEvenementDto updateTypeEvenement(TypeEvenementDto typeEvenenement); 
	void deleteTypeEvenement(TypeEvenementDto typeEvenenement); 
	void deleteTypeEvenementById(Long id); 
	TypeEvenementDto getTypeEvenement(Long id); 
	List<TypeEvenementDto> getAllTypeEvenement();
	TypeEvenementDto convertEntityToDto (TypeEvenement typeEvenement);
	TypeEvenement convertDtoToEntity(TypeEvenementDto typeEvenementDto);

}
