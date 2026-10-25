package com.hotel.guestrequest.dto;

import com.hotel.guestrequest.entity.enums.RequestPriority;
import com.hotel.guestrequest.entity.enums.RequestStatus;
import com.hotel.guestrequest.entity.enums.RequestType;

import java.time.Instant;

public record RequestResponseDTO(
		Long id,
		String roomNumber,
		String guestName,
		RequestType requestType,
		RequestPriority requestPriority,
		String description,
		RequestStatus status,
		Instant createdAt,
		Instant updatedAt) {
}