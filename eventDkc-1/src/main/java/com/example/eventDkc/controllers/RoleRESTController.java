package com.example.eventDkc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventDkc.dto.RoleDto;
import com.example.eventDkc.services.RoleService;

@RestController
@RequestMapping("/api/role")
@CrossOrigin
public class RoleRESTController {
	@Autowired
	RoleService roleService ;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<RoleDto> getAllRole() {
		return roleService.getAllRole();
	}
	
	@RequestMapping(value="/{id}",method = RequestMethod.GET) 
	public RoleDto getRoleById(@PathVariable("id") Long id) { 
		return roleService.getRole(id); 
		} 
	
	@RequestMapping(method = RequestMethod.POST) 
	public RoleDto createRole(@RequestBody RoleDto role) { 
		return roleService.saveRole(role); 
		} 
	
	@RequestMapping(method = RequestMethod.PUT) 
	public RoleDto updateRole(@RequestBody RoleDto role) { 
		return roleService.updateRole(role); 
		}
	
	@RequestMapping(value="/{id}",method = RequestMethod.DELETE) 
	public void deleteRole(@PathVariable("id") Long id) { 
	roleService.deleteRoleById(id); 
	}
	
	

}
