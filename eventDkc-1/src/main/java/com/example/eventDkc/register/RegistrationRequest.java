package com.example.eventDkc.register;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class RegistrationRequest {

	@JsonProperty("nom")
	private String nom ;
	@JsonProperty("prenom")
	private String prenom ;
	@JsonProperty("username")
	private String username ;
	@JsonProperty("password")
	private String password ;
	@JsonProperty("email")
	private String email ;
	@JsonProperty("telephone")
	private String telephone ;

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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
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
}
