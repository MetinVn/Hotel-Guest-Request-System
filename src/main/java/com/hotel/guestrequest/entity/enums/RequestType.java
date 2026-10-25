package com.hotel.guestrequest.entity.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum RequestType {

	@JsonProperty("House keeping")
	HOUSE_KEEPING,

	@JsonProperty("Maintenance")
	MAINTENANCE,

	@JsonProperty("Room service")
	ROOM_SERVICE,

	@JsonProperty("Amenities")
	AMENITIES,

	@JsonProperty("VIP Service")
	VIP_SERVICE,
}
