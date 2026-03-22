package com.example.eventDkc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventDkc.dto.LieuDto;
import com.example.eventDkc.services.LieuService;

@RestController
@RequestMapping("/api/lieu")
@CrossOrigin
public class LieuRESTController {
	@Autowired
	LieuService lieuService ;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<LieuDto> getAllLieu() {
		return lieuService.getAllLieu();
	}
	
	@RequestMapping(value="/{id}",method = RequestMethod.GET) 
	public LieuDto getLieuById(@PathVariable("id") Long id) { 
		return lieuService.getLieu(id); 
		} 
	
	@RequestMapping(method = RequestMethod.POST) 
	public LieuDto createLieu(@RequestBody LieuDto lieu) { 
		return lieuService.saveLieu(lieu); 
		} 
	
	@RequestMapping(method = RequestMethod.PUT) 
	public LieuDto updateLieu(@RequestBody LieuDto lieu) { 
		return lieuService.updateLieu(lieu); 
		}
	
	@RequestMapping(value="/{id}",method = RequestMethod.DELETE) 
	public void deleteLieu(@PathVariable("id") Long id) { 
	lieuService.deleteLieuById(id); 
	}

}
