package iuh.fit.backend.dto.order;

import iuh.fit.backend.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String username;
    private String userEmail;
    private Double totalAmount;
    private OrderStatus status;
    private String shippingAddress;
    private String phoneNumber;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> orderItems;
    private Integer totalItems;
    
    // Constructor for basic order info (without items)
    public OrderResponse(Long id, String orderNumber, Long userId, String username, String userEmail,
                        Double totalAmount, OrderStatus status, String shippingAddress, String phoneNumber,
                        String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.userId = userId;
        this.username = username;
        this.userEmail = userEmail;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.phoneNumber = phoneNumber;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}