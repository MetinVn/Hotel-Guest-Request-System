package com.hotel.guestrequest.service;

import com.hotel.guestrequest.dto.CreateRequestDTO;
import com.hotel.guestrequest.dto.RequestResponseDTO;
import com.hotel.guestrequest.dto.UpdateRequestDTO;
import com.hotel.guestrequest.dto.UpdateRequestStatusDTO;
import com.hotel.guestrequest.entity.GuestRequestEntity;
import com.hotel.guestrequest.entity.enums.RequestPriority;
import com.hotel.guestrequest.entity.enums.RequestStatus;
import com.hotel.guestrequest.exception.ResourceNotFoundException;
import com.hotel.guestrequest.repository.GuestRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class GuestRequestService {

	private final GuestRequestRepository guestRequestRepository;

	@Transactional(readOnly = true)
	public Page<RequestResponseDTO> getAllRequests(
			RequestStatus status,
			RequestPriority priority,
			String search,
			Pageable pageable) {
		Specification<GuestRequestEntity> specification = (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (status != null) {
				predicates.add(criteriaBuilder.equal(root.get("status"), status));
			}
			if (priority != null) {
				predicates.add(criteriaBuilder.equal(root.get("requestPriority"), priority));
			}
			if (search != null && !search.isBlank()) {
				String searchPattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
				predicates.add(criteriaBuilder.or(
						criteriaBuilder.like(criteriaBuilder.lower(root.get("guestName")), searchPattern),
						criteriaBuilder.like(criteriaBuilder.lower(root.get("roomNumber")), searchPattern)));
			}
			return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
		};
		return guestRequestRepository.findAll(specification, pageable)
				.map(this::toResponseDTO);
	}

	@Transactional(readOnly = true)
	public RequestResponseDTO getRequestById( Long id) {
		return toResponseDTO(findRequestById(id));
	}

	@Transactional(readOnly = true)
	public Page<RequestResponseDTO> getRequestsByRoomNumber(String roomNumber, Pageable pageable) {
		return guestRequestRepository.findByRoomNumber(roomNumber, pageable)
				.map(this::toResponseDTO);
	}

	@Transactional
	public RequestResponseDTO updateStatus( Long id, UpdateRequestStatusDTO dto) {
		GuestRequestEntity request = findRequestById(id);
		request.setStatus(dto.getStatus());
		log.info("Updated guest request {} status to {}", id, request.getStatus());
		return toResponseDTO(request);
	}

	@Transactional
	public RequestResponseDTO updateRequest( Long id, UpdateRequestDTO dto) {
		GuestRequestEntity request = findRequestById(id);
		request.setRoomNumber(dto.getRoomNumber());
		request.setGuestName(dto.getGuestName());
		request.setRequestType(dto.getRequestType());
		request.setRequestPriority(dto.getRequestPriority());
		request.setDescription(dto.getDescription());

		log.info("Updated guest request {}", id);
		return toResponseDTO(request);
	}

	@Transactional
	public RequestResponseDTO createRequest( CreateRequestDTO dto) {
		GuestRequestEntity request = new GuestRequestEntity();
		request.setRoomNumber(dto.getRoomNumber());
		request.setGuestName(dto.getGuestName());
		request.setRequestPriority(dto.getRequestPriority() == null ? RequestPriority.NORMAL : dto.getRequestPriority());
		request.setRequestType(dto.getRequestType());
		request.setDescription(dto.getDescription());
		request.setStatus(RequestStatus.PENDING);

		GuestRequestEntity savedRequest = guestRequestRepository.saveAndFlush(request);
		log.info("Created guest request {}", savedRequest.getId());
		return toResponseDTO(savedRequest);
	}

	@Transactional
	public void deleteGuestRequest(Long id) {
		guestRequestRepository.delete(findRequestById(id));
		log.info("Deleted guest request {}", id);
	}

	private GuestRequestEntity findRequestById(Long id) {
		return guestRequestRepository.findById(id)
				.orElseThrow(() -> {
					log.warn("Guest request {} was not found", id);
					return new ResourceNotFoundException("Guest request with id " + id + " was not found");
				});
	}

	private RequestResponseDTO toResponseDTO( GuestRequestEntity entity) {
		return new RequestResponseDTO(
				entity.getId(),
				entity.getRoomNumber(),
				entity.getGuestName(),
				entity.getRequestType(),
				entity.getRequestPriority(),
				entity.getDescription(),
				entity.getStatus(),
				entity.getCreatedAt(),
				entity.getUpdatedAt()
		);
	}

}
