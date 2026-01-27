package iuh.fit.backend.dto.product;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private String brand;
    private String model;
    private String specifications;
    private Boolean isActive;
    private LocalDateTime createdAt;
    
    // Category info
    private Long categoryId;
    private String categoryName;
}