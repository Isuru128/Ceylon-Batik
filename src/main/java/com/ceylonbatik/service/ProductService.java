package com.ceylonbatik.service;

import java.util.List;
import java.util.Optional;

import com.ceylonbatik.model.Product;
import com.ceylonbatik.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findProducts(String category) {
        if (category == null || category.isBlank() || "all".equalsIgnoreCase(category)) {
            return productRepository.findByActiveTrue();
        }

        return productRepository.findByCategoryIgnoreCaseAndActiveTrue(category);
    }

    public Optional<Product> findBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            return Optional.empty();
        }

        return productRepository.findBySlugAndActiveTrue(slug);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product save(Product product) {
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            String slug = product.getTitle().toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("(^-|-$)", "");
            product.setSlug(slug);
        }
        return productRepository.save(product);
    }

    public void deleteById(String id) {
        productRepository.deleteById(id);
    }
}
