package com.hotel.guestrequest.entity.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum RequestStatus {

	@JsonProperty("Pending")
	PENDING,

	@JsonProperty("In Progress")
	IN_PROGRESS,

	@JsonProperty("Completed")
	COMPLETED,
}
