package iuh.fit.backend.dto.order;

import iuh.fit.backend.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    
    @NotNull(message = "Order status is required")
    private OrderStatus status;
    
    private String notes; // Optional notes when updating status
}