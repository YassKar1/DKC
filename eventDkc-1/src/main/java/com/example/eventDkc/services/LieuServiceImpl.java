package com.example.eventDkc.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventDkc.dto.LieuDto;
import com.example.eventDkc.entities.Lieu;
import com.example.eventDkc.repositories.LieuRepository;

@Service
public class LieuServiceImpl implements LieuService {
	
	@Autowired
	ModelMapper modelMapper ;
	
	@Autowired
	LieuRepository lieuRepository ;

	@Override
	public LieuDto saveLieu(LieuDto lieu) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(lieuRepository.save(this.convertDtoToEntity(lieu)));
	}

	@Override
	public LieuDto updateLieu(LieuDto lieu) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(lieuRepository.save(this.convertDtoToEntity(lieu)));
	}

	@Override
	public void deleteLieu(LieuDto lieu) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteLieuById(Long id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public LieuDto getLieu(Long id) {
		// TODO Auto-generated method stub
		return convertEntityToDto(lieuRepository.findById(id).get());
	}

	@Override
	public List<LieuDto> getAllLieu() {
		// TODO Auto-generated method stub
		return lieuRepository.findAll().stream()
		.map(this::convertEntityToDto)
		.collect(Collectors.toList());
	}

	@Override
	public LieuDto convertEntityToDto(Lieu lieu) {
		// TODO Auto-generated method stub
		LieuDto lieuDto = modelMapper.map(lieu, LieuDto.class);
		return lieuDto ;
	}

	@Override
	public Lieu convertDtoToEntity(LieuDto lieuDto) {
		// TODO Auto-generated method stub
		Lieu lieu = new Lieu();
		lieu = modelMapper.map(lieuDto, Lieu.class) ;
		return lieu;
	}

}
