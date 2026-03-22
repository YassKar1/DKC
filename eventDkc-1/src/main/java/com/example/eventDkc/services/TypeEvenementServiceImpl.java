package com.example.eventDkc.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventDkc.dto.TypeEvenementDto;
import com.example.eventDkc.entities.TypeEvenement;
import com.example.eventDkc.repositories.TypeEvenementRepository;

@Service
public class TypeEvenementServiceImpl implements TypeEvenementService {
	
	@Autowired
	ModelMapper modelMapper ;
	
	@Autowired
	TypeEvenementRepository typeEvenementRepository ;

	@Override
	public TypeEvenementDto saveTypeEvenement(TypeEvenementDto typeEvenement) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(typeEvenementRepository.save(this.convertDtoToEntity(typeEvenement)));
	}

	@Override
	public TypeEvenementDto updateTypeEvenement(TypeEvenementDto typeEvenement) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(typeEvenementRepository.save(this.convertDtoToEntity(typeEvenement)));
	}

	@Override
	public void deleteTypeEvenement(TypeEvenementDto typeEvenement) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteTypeEvenementById(Long id) {
		// TODO Auto-generated method stub
		typeEvenementRepository.deleteById(id);
	}

	@Override
	public TypeEvenementDto getTypeEvenement(Long id) {
		// TODO Auto-generated method stub
		return convertEntityToDto(typeEvenementRepository.findById(id).get());
	}

	@Override
	public List<TypeEvenementDto> getAllTypeEvenement() {
		// TODO Auto-generated method stub
		return typeEvenementRepository.findAll().stream()
				.map(this::convertEntityToDto)
				.collect(Collectors.toList());
	}

	@Override
	public TypeEvenementDto convertEntityToDto(TypeEvenement typeEvenement) {
		TypeEvenementDto typeEvenementDto = modelMapper.map(typeEvenement, TypeEvenementDto.class);
		// TODO Auto-generated method stub
		return typeEvenementDto;
	}

	@Override
	public TypeEvenement convertDtoToEntity(TypeEvenementDto typeEvenementDto) {
		// TODO Auto-generated method stub
		TypeEvenement typeEvenement = new TypeEvenement();
		typeEvenement = modelMapper.map(typeEvenementDto, TypeEvenement.class);
		return typeEvenement ;
	}
}