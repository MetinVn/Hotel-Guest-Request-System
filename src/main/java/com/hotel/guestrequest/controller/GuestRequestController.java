package com.hotel.guestrequest.controller;

import com.hotel.guestrequest.dto.CreateRequestDTO;
import com.hotel.guestrequest.dto.PaginatedResponseDTO;
import com.hotel.guestrequest.dto.RequestResponseDTO;
import com.hotel.guestrequest.dto.UpdateRequestDTO;
import com.hotel.guestrequest.dto.UpdateRequestStatusDTO;
import com.hotel.guestrequest.entity.enums.RequestPriority;
import com.hotel.guestrequest.entity.enums.RequestStatus;
import com.hotel.guestrequest.service.GuestRequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;

@RestController
@RequestMapping(value = "/api/v1/requests")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class GuestRequestController {

	private static final int MAX_PAGE_SIZE = 100;
	private final GuestRequestService guestRequestService;

	public GuestRequestController(GuestRequestService guestRequestService) {
		this.guestRequestService = guestRequestService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public RequestResponseDTO createRequest( @Valid @RequestBody CreateRequestDTO dto) {
		return guestRequestService.createRequest(dto);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteRequest(@PathVariable("id") Long id) {
		guestRequestService.deleteGuestRequest(id);
	}

	@GetMapping
	public PaginatedResponseDTO<RequestResponseDTO> getAllRequests(
			@RequestParam(required = false) RequestStatus status,
			@RequestParam(required = false) RequestPriority priority,
			@RequestParam(required = false) String search,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "asc") String sortOrder) {
		if (page < 0 || size < 1) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"page must be non-negative and size must be positive");
		}
		Page<RequestResponseDTO> requests = guestRequestService.getAllRequests(
				status,
				priority,
				search,
				PageRequest.of(page, Math.min(size, MAX_PAGE_SIZE), buildSort(sortBy, sortOrder)));
		return toPaginatedResponse(requests);
	}

	private Sort buildSort(String sortBy, String sortOrder) {
		Sort.Direction direction = switch (sortOrder.toLowerCase(Locale.ROOT)) {
			case "asc" -> Sort.Direction.ASC;
			case "desc" -> Sort.Direction.DESC;
			default -> throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"sortOrder must be asc or desc");
		};
		Sort primarySort = switch (sortBy) {
			case "id" -> Sort.by(direction, "id");
			case "createdAt" -> Sort.by(direction, "createdAt");
			case "priority" -> Sort.by(direction, "requestPriority");
			default -> throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"sortBy must be one of: id, createdAt, priority");
		};
		return primarySort.and(Sort.by(Sort.Direction.ASC, "id"));
	}

	private PaginatedResponseDTO<RequestResponseDTO> toPaginatedResponse(Page<RequestResponseDTO> page) {
		return new PaginatedResponseDTO<>(
				page.getContent(),
				page.getNumber(),
				page.getTotalPages(),
				page.getTotalElements(),
				page.hasNext());
	}

	@GetMapping("/{id}")
	public RequestResponseDTO getRequestById( @PathVariable("id") Long id) {
		return guestRequestService.getRequestById(id);
	}

	@PutMapping("/{id}")
	public RequestResponseDTO updateRequest(
			@PathVariable("id") Long id,
			@Valid @RequestBody UpdateRequestDTO dto) {
		return guestRequestService.updateRequest(id, dto);
	}

	@GetMapping("/rooms/{roomNumber}")
	public PaginatedResponseDTO<RequestResponseDTO> getRequestsByRoomNumber(
			@PathVariable("roomNumber") String roomNumber,
			@PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<RequestResponseDTO> requests = guestRequestService.getRequestsByRoomNumber(roomNumber, pageable);
		return toPaginatedResponse(requests);
	}

	@PatchMapping("/{id}/status")
	public RequestResponseDTO updateStatus(
			@PathVariable("id") Long id,
			@Valid @RequestBody UpdateRequestStatusDTO dto) {
		return guestRequestService.updateStatus(id, dto);
	}

}
