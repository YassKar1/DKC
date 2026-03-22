package com.example.eventDkc.services;

import java.util.List;

import com.example.eventDkc.dto.RoleDto;
import com.example.eventDkc.entities.Role;

public interface RoleService {
	RoleDto saveRole(RoleDto role); 
	RoleDto updateRole(RoleDto role); 
	void deleteRole(RoleDto role); 
	void deleteRoleById(Long id); 
	RoleDto getRole(Long id); 
	List<RoleDto> getAllRole();
	RoleDto convertEntityToDto (Role role);
	Role convertDtoToEntity(RoleDto roleDto);

}
