package com.example.eventDkc.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EvenementDto {
	
	private Long id ;
	
	private String nomEvenement ;
	private LocalDateTime dateHeureDebut ;
	private LocalDateTime dateHeureFin ; 
	private String description ;

	private BigDecimal prix ;
	private Double promo ;
	
	private LieuDto lieuDto ;
	private UserDto userDto ;
	private TypeEvenementDto typeEvenementDto ;
	private long inscriptionCount;

	
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
	public LieuDto getLieuDto() {
		return lieuDto;
	}
	public void setLieuDto(LieuDto lieuDto) {
		this.lieuDto = lieuDto;
	}
	public UserDto getUserDto() {
		return userDto;
	}
	public void setUserDto(UserDto userDto) {
		this.userDto = userDto;
	}
	public TypeEvenementDto getTypeEvenementDto() {
		return typeEvenementDto;
	}
	public void setTypeEvenementDto(TypeEvenementDto typeEvenementDto) {
		this.typeEvenementDto = typeEvenementDto;
	}
	public long getInscriptionCount() {
		return inscriptionCount;
	}
	public void setInscriptionCount(long inscriptionCount) {
		this.inscriptionCount = inscriptionCount;
	}
}
