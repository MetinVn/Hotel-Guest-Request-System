package com.hotel.guestrequest.entity.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum RequestPriority {
	@JsonProperty("Urgent")
	URGENT,

	@JsonProperty("Normal")
	NORMAL,

	@JsonProperty("Low")
	LOW,

}
