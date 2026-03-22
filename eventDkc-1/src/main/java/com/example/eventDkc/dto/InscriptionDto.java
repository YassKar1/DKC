package com.example.eventDkc.dto;

import java.time.LocalDateTime;

public class InscriptionDto {
	
	private Long id ;

	private String nom ;
	private String prenom ;
	private String mail ;
	
	private LocalDateTime dateInscription ;
	private LocalDateTime dateAnnulation ;
	private boolean statut ;

	private Long utilisateurId ;
	private Long evenementId ;
	/** Titre de l'événement (listes / réservations). */
	private String evenementNom ;
	
	private UserDto userDto ;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public LocalDateTime getDateInscription() {
		return dateInscription;
	}
	public void setDateInscription(LocalDateTime dateInscription) {
		this.dateInscription = dateInscription;
	}
	public LocalDateTime getDateAnnulation() {
		return dateAnnulation;
	}
	public void setDateAnnulation(LocalDateTime dateAnnulation) {
		this.dateAnnulation = dateAnnulation;
	}
	public boolean isStatut() {
		return statut;
	}
	public void setStatut(boolean statut) {
		this.statut = statut;
	}
	public Long getUtilisateurId() {
		return utilisateurId;
	}
	public void setUtilisateurId(Long utilisateurId) {
		this.utilisateurId = utilisateurId;
	}
	public Long getEvenementId() {
		return evenementId;
	}
	public void setEvenementId(Long evenementId) {
		this.evenementId = evenementId;
	}
	public String getEvenementNom() {
		return evenementNom;
	}
	public void setEvenementNom(String evenementNom) {
		this.evenementNom = evenementNom;
	}
	public UserDto getUserDto() {
		return userDto;
	}
	public void setUserDto(UserDto userDto) {
		this.userDto = userDto;
	}
}
