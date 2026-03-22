package com.example.eventDkc.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventDkc.dto.RoleDto;
import com.example.eventDkc.entities.Role;
import com.example.eventDkc.repositories.RoleRepository;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	ModelMapper modelMapper ;
	
	@Autowired
	RoleRepository roleRepository ;
	@Override
	public RoleDto saveRole(RoleDto role) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(roleRepository.save(this.convertDtoToEntity(role))) ;
	}

	@Override
	public RoleDto updateRole(RoleDto role) {
		// TODO Auto-generated method stub
		return this.convertEntityToDto(roleRepository.save(this.convertDtoToEntity(role))) ;
	}

	@Override
	public void deleteRole(RoleDto role) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteRoleById(Long id) {
		// TODO Auto-generated method stub
		roleRepository.deleteById(id);
	}

	@Override
	public RoleDto getRole(Long id) {
		// TODO Auto-generated method stub
		return convertEntityToDto(roleRepository.findById(id).get());
	}

	@Override
	public List<RoleDto> getAllRole() {
		// TODO Auto-generated method stub
		return roleRepository.findAll().stream()
				.map(this::convertEntityToDto)
				.collect(Collectors.toList());

	}

	@Override
	public RoleDto convertEntityToDto(Role role) {
		RoleDto roleDto = modelMapper.map(role, RoleDto.class);
		return roleDto;
	}

	@Override
	public Role convertDtoToEntity(RoleDto roleDto) {
		// TODO Auto-generated method stub
		Role role = new Role();
		role = modelMapper.map(roleDto, Role.class);

		return role;
	}

}
