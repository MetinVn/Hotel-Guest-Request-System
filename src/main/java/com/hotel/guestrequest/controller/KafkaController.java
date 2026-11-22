package com.hotel.guestrequest.controller;


import com.hotel.guestrequest.service.KafkaProducerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {

	private final KafkaProducerService producerService;

	public KafkaController(KafkaProducerService producerService) {
		this.producerService = producerService;
	}

	@GetMapping("/send")
	public String sendMessage(@RequestParam String message) {
		producerService.sendMessage(message);
		return "Message sent successfully!";
	}
}
