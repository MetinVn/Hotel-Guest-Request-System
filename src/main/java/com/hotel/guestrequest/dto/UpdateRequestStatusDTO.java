package com.hotel.guestrequest.dto;

import com.hotel.guestrequest.entity.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRequestStatusDTO {

	@NotNull(message = "Status cannot be null")
	private RequestStatus status;
}
