package iuh.fit.backend.dto.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
    private LocalDateTime createdAt;
    
    // Constructor for easy mapping
    public OrderItemResponse(Long id, Long productId, String productName, String productImageUrl,
                           Integer quantity, Double unitPrice, Double totalPrice, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
    }
}