package iuh.fit.backend.dto.order;

import lombok.Data;

@Data
public class OrderStatsResponse {
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long processingOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private Double totalRevenue;
    private Double pendingRevenue;
    private Double completedRevenue;
    
    public OrderStatsResponse() {
        this.totalOrders = 0;
        this.pendingOrders = 0;
        this.confirmedOrders = 0;
        this.processingOrders = 0;
        this.shippedOrders = 0;
        this.deliveredOrders = 0;
        this.cancelledOrders = 0;
        this.totalRevenue = 0.0;
        this.pendingRevenue = 0.0;
        this.completedRevenue = 0.0;
    }
}