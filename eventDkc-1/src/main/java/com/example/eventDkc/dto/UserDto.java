package com.example.eventDkc.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {
	
	private Long id ;
	
	private String username ;
	private String nom ;
	private String prenom ; 
	private String email ; 
	private String telephone ;
	private String mdp ;
	
	private LieuDto lieuDto ;
	private RoleDto roleDto ;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	@JsonIgnore
	public String getMdp() {
		return mdp;
	}
	public void setMdp(String mdp) {
		this.mdp = mdp;
	}
	public LieuDto getLieuDto() {
		return lieuDto;
	}
	public void setLieuDto(LieuDto lieuDto) {
		this.lieuDto = lieuDto;
	}
	/** Exposé en JSON sous le nom "role" pour l'API (cohérent avec l'entité User). */
	@JsonProperty("role")
	public RoleDto getRoleDto() {
		return roleDto;
	}
	@JsonProperty("role")
	public void setRoleDto(RoleDto roleDto) {
		this.roleDto = roleDto;
	}
}