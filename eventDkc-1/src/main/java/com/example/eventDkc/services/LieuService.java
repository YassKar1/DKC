package com.example.eventDkc.services;

import java.util.List;

import com.example.eventDkc.dto.LieuDto;
import com.example.eventDkc.entities.Lieu;


public interface LieuService {
	
	LieuDto saveLieu(LieuDto lieu); 
	LieuDto updateLieu(LieuDto lieu); 
	void deleteLieu(LieuDto lieu); 
	void deleteLieuById(Long id); 
	LieuDto getLieu(Long id); 
	List<LieuDto> getAllLieu();
	LieuDto convertEntityToDto (Lieu lieu);
	Lieu convertDtoToEntity(LieuDto lieuDto);
}
