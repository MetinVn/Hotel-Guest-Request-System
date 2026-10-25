package com.hotel.guestrequest.entity;

import com.hotel.guestrequest.entity.enums.RequestPriority;
import com.hotel.guestrequest.entity.enums.RequestStatus;
import com.hotel.guestrequest.entity.enums.RequestType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "guest_requests")
@NoArgsConstructor
@Getter
@Setter
public class GuestRequestEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "room_number", length = 10, nullable = false)
	private String roomNumber;

	@Column(name = "guest_name", length = 100, nullable = false)
	private String guestName;

	@Enumerated(EnumType.STRING)
	@Column(name = "request_type", nullable = false)
	private RequestType requestType;

	@Column(name = "status", nullable = false)
	@Enumerated(EnumType.STRING)
	private RequestStatus status;

	@ColumnDefault("'NORMAL'")
	@Column(name = "priority", nullable = false)
	@Enumerated(EnumType.STRING)
	private RequestPriority requestPriority;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@Column(name = "description", length = 1000, nullable = false)
	private String description;
}
