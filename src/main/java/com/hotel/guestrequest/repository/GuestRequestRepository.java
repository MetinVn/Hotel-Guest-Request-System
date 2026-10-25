package com.hotel.guestrequest.repository;

import com.hotel.guestrequest.entity.GuestRequestEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GuestRequestRepository extends JpaRepository<GuestRequestEntity, Long>,
		JpaSpecificationExecutor<GuestRequestEntity> {
			Page<GuestRequestEntity> findByRoomNumber(String roomNumber, Pageable pageable);
		}
