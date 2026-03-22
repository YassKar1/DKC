package com.example.eventDkc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.eventDkc.entities.Role;

@RepositoryRestResource(path = "rest") 
public interface RoleRepository extends JpaRepository<Role, Long> {

	Role findByNomRole(String nomRole);

}
