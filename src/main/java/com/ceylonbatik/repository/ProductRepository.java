package com.ceylonbatik.repository;

import java.util.List;
import java.util.Optional;

import com.ceylonbatik.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByActiveTrue();

    List<Product> findByCategoryIgnoreCaseAndActiveTrue(String category);

    Optional<Product> findBySlugAndActiveTrue(String slug);
}
