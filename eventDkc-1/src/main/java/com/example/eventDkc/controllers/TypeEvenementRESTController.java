package com.example.eventDkc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventDkc.dto.TypeEvenementDto;
import com.example.eventDkc.services.TypeEvenementService;

@RestController
@RequestMapping("/api/typeEvenement")
@CrossOrigin
public class TypeEvenementRESTController {
	@Autowired
	TypeEvenementService typeEvenementService ;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<TypeEvenementDto> getAllTypeEvenement() {
		return typeEvenementService.getAllTypeEvenement();
	}
	
	@RequestMapping(value="/{id}",method = RequestMethod.GET) 
	public TypeEvenementDto getTypeEvenementById(@PathVariable("id") Long id) { 
		return typeEvenementService.getTypeEvenement(id); 
		} 
	
	@RequestMapping(method = RequestMethod.POST) 
	public TypeEvenementDto createTypeEvenement(@RequestBody TypeEvenementDto typeEvenement) { 
		return typeEvenementService.saveTypeEvenement(typeEvenement); 
		} 
	
	@RequestMapping(method = RequestMethod.PUT) 
	public TypeEvenementDto updateTypeEvenement(@RequestBody TypeEvenementDto typeEvenement) { 
		return typeEvenementService.updateTypeEvenement(typeEvenement); 
		}
	
	@RequestMapping(value="/{id}",method = RequestMethod.DELETE) 
	public void deleteTypeEvenement(@PathVariable("id") Long id) { 
	typeEvenementService.deleteTypeEvenementById(id); 
	}

}
