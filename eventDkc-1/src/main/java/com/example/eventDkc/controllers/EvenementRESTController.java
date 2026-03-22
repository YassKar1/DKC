package com.example.eventDkc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventDkc.dto.EvenementDto;
import com.example.eventDkc.services.EvenementService;

@RestController
@RequestMapping("/api/evenement")
@CrossOrigin
public class EvenementRESTController {
	@Autowired
	EvenementService evenementService ;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<EvenementDto> getAllEvenement() {
		return evenementService.getAllEvenement();
	}
	
	@RequestMapping(value="/{id}",method = RequestMethod.GET) 
	public EvenementDto getEvenementById(@PathVariable("id") Long id) { 
		return evenementService.getEvenement(id); 
		} 
	
	@RequestMapping(method = RequestMethod.POST) 
	public EvenementDto createEvenement(@RequestBody EvenementDto evenement) { 
		return evenementService.saveEvenement(evenement); 
		} 
	
	@RequestMapping(method = RequestMethod.PUT) 
	public EvenementDto updateEvenement(@RequestBody EvenementDto evenement) { 
		return evenementService.updateEvenement(evenement); 
		}
	
	@RequestMapping(value="/{id}",method = RequestMethod.DELETE) 
	public void deleteEvenement(@PathVariable("id") Long id) { 
	evenementService.deleteEvenementById(id); 
	}
	

}
