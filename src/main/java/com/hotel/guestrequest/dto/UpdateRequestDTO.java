package com.hotel.guestrequest.dto;

import com.hotel.guestrequest.entity.enums.RequestPriority;
import com.hotel.guestrequest.entity.enums.RequestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRequestDTO {

	@NotBlank(message = "Room number cannot be empty")
	@Size(max = 10, message = "Room number cannot exceed 10 characters")
	private String roomNumber;

	@NotBlank(message = "Guest name cannot be empty")
	@Size(max = 100, message = "Guest name cannot exceed 100 characters")
	private String guestName;

	@NotNull(message = "Request type is required")
	private RequestType requestType;

	@NotNull(message = "Priority is required")
	private RequestPriority requestPriority;

	@NotBlank(message = "Description cannot be blank")
	@Size(max = 1000, message = "Description cannot exceed 1000 characters")
	private String description;
}
