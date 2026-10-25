package com.hotel.guestrequest.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ProblemDetail handleResourceNotFound(ResourceNotFoundException exception) {
		log.warn("Resource not found: {}", exception.getMessage());
		return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ProblemDetail handleValidationErrors(MethodArgumentNotValidException exception) {
		Map<String, String> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(
						FieldError::getField,
						error -> error.getDefaultMessage() == null ? "Invalid value" : error.getDefaultMessage(),
						(existing, ignored) -> existing,
						TreeMap::new));
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
				HttpStatus.BAD_REQUEST, "Request validation failed");
		problemDetail.setProperty("errors", fieldErrors);
		return problemDetail;
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ProblemDetail handleUnreadableRequest(HttpMessageNotReadableException exception) {
		return ProblemDetail.forStatusAndDetail(
				HttpStatus.BAD_REQUEST, "Request body is malformed or contains an unsupported value");
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ProblemDetail handleInvalidParameter(MethodArgumentTypeMismatchException exception) {
		return ProblemDetail.forStatusAndDetail(
				HttpStatus.BAD_REQUEST, "Request parameter has an invalid value");
	}

}
