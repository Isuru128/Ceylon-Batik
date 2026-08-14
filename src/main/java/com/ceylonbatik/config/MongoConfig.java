package com.ceylonbatik.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Manual Mongo configuration.
 *
 * NOTE: because @EnableMongoRepositories is declared explicitly here,
 * Spring Boot's automatic Mongo configuration backs off and expects
 * this class to supply MongoClient / MongoDatabaseFactory / MongoTemplate
 * itself. That's why mongoTemplate previously couldn't be found - nothing
 * was defining it. The three beans below fix that, reading the connection
 * string straight from application.properties (spring.data.mongodb.uri).
 */
@Configuration
@EnableMongoRepositories(basePackages = "com.ceylonbatik.repository")
@EnableMongoAuditing
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        return new SimpleMongoClientDatabaseFactory(mongoClient, databaseName);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDatabaseFactory) {
        return new MongoTemplate(mongoDatabaseFactory);
    }

    /**
     * Tests MongoDB connection when Spring Boot starts.
     */
    @Bean
    public ApplicationRunner mongoConnectionLogger(MongoTemplate mongoTemplate) {

        return args -> {

            try {

                mongoTemplate
                        .getDb()
                        .runCommand(new Document("ping", 1));

                log.info("MongoDB connected successfully: {}", mongoTemplate.getDb().getName());

            } catch (Exception exception) {

                log.error("MongoDB connection failed: {}", exception.getMessage(), exception);

            }

        };
    }
}