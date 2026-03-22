package com.example.eventDkc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventDkc.entities.Evenement;

public interface EvenementRepository extends JpaRepository<Evenement, Long> {

	List<Evenement> findByUser_Id(Long userId);

	@Modifying
	@Query("DELETE FROM Evenement e WHERE e.user.id = :userId")
	void deleteEvenementsByUserId(@Param("userId") Long userId);
}
