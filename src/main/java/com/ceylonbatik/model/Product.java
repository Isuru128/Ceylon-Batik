package com.ceylonbatik.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String title;
    private String category;
    private String description;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private String imageUrl;
    private List<String> tags = new ArrayList<>();
    private boolean active = true;

    public Product() {
    }

}
