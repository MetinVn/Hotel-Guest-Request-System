package com.hotel.guestrequest.dto;

import java.util.List;

public record PaginatedResponseDTO<T>(
		List<T> content,
		int currentPage,
		int totalPages,
		long totalElements,
		boolean hasNext) {
}
