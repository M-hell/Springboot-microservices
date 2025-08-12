package com.fitness.aiservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    @Value("${rabbitmq.queue.name}") // Reads the queue name from application properties
    private String queue;

    @Value("${rabbitmq.exchange.name}") // Reads the exchange name from application properties
    private String exchange;

    @Value("${rabbitmq.routing.key}") // Reads the routing key from application properties
    private String routingKey;

    @Bean
    public Queue activityQueue() { // Creates a durable queue named "activity.queue"
        return new Queue(queue, true);
    }

    @Bean
    public DirectExchange activityExchange() { // Creates a direct exchange named "fitness.exchange"
        return new DirectExchange(exchange);
    }

    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) { // Binds the queue to the exchange with the specified routing key
        return BindingBuilder.bind(activityQueue).to(activityExchange).with(routingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() { //converts java objects to JSON
        return new Jackson2JsonMessageConverter();
    }
}