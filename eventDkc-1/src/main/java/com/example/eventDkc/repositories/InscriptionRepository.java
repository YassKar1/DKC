package com.example.eventDkc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventDkc.entities.Inscription;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {

	List<Inscription> findByUser_Id(Long userId);

	@Query("SELECT i FROM Inscription i JOIN FETCH i.evenement WHERE i.user.id = :userId ORDER BY i.dateInscription DESC")
	List<Inscription> findByUser_IdWithEvenement(@Param("userId") Long userId);

	boolean existsByUser_IdAndEvenement_Id(Long userId, Long evenementId);

	void deleteByUser_IdAndEvenement_Id(Long userId, Long evenementId);

	void deleteByEvenement_Id(Long evenementId);

	long countByEvenement_Id(Long evenementId);

	@Query("SELECT COUNT(i) FROM Inscription i WHERE i.evenement.id = :eid")
	long countInscriptionsForEvenement(@Param("eid") Long evenementId);

	/** Inscriptions sur les événements créés par cet utilisateur (à supprimer avant les événements). */
	@Modifying
	@Query("DELETE FROM Inscription i WHERE i.evenement.user.id = :userId")
	void deleteInscriptionsForEventsCreatedBy(@Param("userId") Long userId);

	/** Inscriptions où cet utilisateur est inscrit (y compris sur les événements d'autres créateurs). */
	@Modifying
	@Query("DELETE FROM Inscription i WHERE i.user.id = :userId")
	void deleteInscriptionsForUserRegistrations(@Param("userId") Long userId);
}
