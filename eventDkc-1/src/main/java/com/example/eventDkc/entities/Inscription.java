package com.example.eventDkc.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inscription")
public class Inscription {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id ;

	@Column(name = "nom")
	private String nom ;
	@Column(name = "prenom")
	private String prenom ;
	@Column(name = "mail")
	private String mail ;
	
	@Column(name = "date_inscription")
	private LocalDateTime dateInscription ;
	@Column(name = "date_annulation")
	private LocalDateTime dateAnnulation ;
	@Column(name = "statut")
	private boolean statut ;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user ;
	
	@ManyToOne
	@JoinColumn(name = "evenement_id")
	private Evenement evenement ;

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
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Evenement getEvenement() {
		return evenement;
	}
	public void setEvenement(Evenement evenement) {
		this.evenement = evenement;
	}
	
}
