package com.example.eventDkc.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Evenement {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id ;
	
	private String nomEvenement ;
	private LocalDateTime dateHeureDebut ;
	private LocalDateTime dateHeureFin ; 
	private String description ;
	
	@ManyToOne
	private Lieu lieu ;
	
	@ManyToOne
	private User user ;

	private BigDecimal prix ;
	private Double promo ;
	
	@ManyToOne
	private TypeEvenement typeEvenement ;
	
	@OneToMany(mappedBy = "evenement")
	List<Inscription> inscriptions ;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNomEvenement() {
		return nomEvenement;
	}
	public void setNomEvenement(String nomEvenement) {
		this.nomEvenement = nomEvenement;
	}
	public LocalDateTime getDateHeureDebut() {
		return dateHeureDebut;
	}
	public void setDateHeureDebut(LocalDateTime dateHeureDebut) {
		this.dateHeureDebut = dateHeureDebut;
	}
	public LocalDateTime getDateHeureFin() {
		return dateHeureFin;
	}
	public void setDateHeureFin(LocalDateTime dateHeureFin) {
		this.dateHeureFin = dateHeureFin;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Lieu getLieu() {
		return lieu;
	}
	public void setLieu(Lieu lieu) {
		this.lieu = lieu;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public BigDecimal getPrix() {
		return prix;
	}
	public void setPrix(BigDecimal prix) {
		this.prix = prix;
	}
	public Double getPromo() {
		return promo;
	}
	public void setPromo(Double promo) {
		this.promo = promo;
	}
	public TypeEvenement getTypeEvenement() {
		return typeEvenement;
	}
	public void setTypeEvenement(TypeEvenement typeEvenement) {
		this.typeEvenement = typeEvenement;
	}
	public List<Inscription> getInscriptions() {
		return inscriptions;
	}
	public void setInscriptions(List<Inscription> inscriptions) {
		this.inscriptions = inscriptions;
	}
	
}
