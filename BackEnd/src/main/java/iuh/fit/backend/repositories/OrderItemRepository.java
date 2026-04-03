package iuh.fit.backend.repositories;

import iuh.fit.backend.entities.Order;
import iuh.fit.backend.entities.OrderItem;
import iuh.fit.backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find order items by order
    List<OrderItem> findByOrderOrderByCreatedAtDesc(Order order);
    
    // Find order items by product
    List<OrderItem> findByProduct(Product product);
    
    // Find order items by order ID
    List<OrderItem> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    
    // Get total quantity sold for a product
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.product.id = :productId")
    Long getTotalQuantitySoldByProduct(@Param("productId") Long productId);
    
    // Get best selling products
    @Query("SELECT oi.product, SUM(oi.quantity) as totalSold FROM OrderItem oi " +
           "GROUP BY oi.product ORDER BY totalSold DESC")
    List<Object[]> getBestSellingProducts();
    
    // Get revenue by product
    @Query("SELECT oi.product, SUM(oi.totalPrice) as totalRevenue FROM OrderItem oi " +
           "GROUP BY oi.product ORDER BY totalRevenue DESC")
    List<Object[]> getRevenueByProduct();
    
    // Count items in order
    long countByOrder(Order order);
}