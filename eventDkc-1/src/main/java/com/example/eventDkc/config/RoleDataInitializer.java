package com.example.eventDkc.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.eventDkc.entities.Role;
import com.example.eventDkc.repositories.RoleRepository;

/**
 * Crée les rôles USER et ADMIN au démarrage s'ils n'existent pas encore.
 */
@Component
public class RoleDataInitializer implements CommandLineRunner {

	private final RoleRepository roleRepository;

	public RoleDataInitializer(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	@Override
	public void run(String... args) {
		ensureRole("USER");
		ensureRole("ADMIN");
	}

	private void ensureRole(String nomRole) {
		if (roleRepository.findByNomRole(nomRole) == null) {
			Role r = new Role();
			r.setNomRole(nomRole);
			roleRepository.save(r);
		}
	}
}
