package com.hotel.guestrequest.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service 
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String message) {
        kafkaTemplate.send("my-topic", message).whenComplete((result, ex) -> {
            if (ex != null) {
                System.err.println("Send failed: " + ex.getMessage());
            } else {
                System.out.println("Sent to " + result.getRecordMetadata().topic()
                        + " partition " + result.getRecordMetadata().partition());
            }
        });
    }
}