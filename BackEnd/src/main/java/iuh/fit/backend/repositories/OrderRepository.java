package iuh.fit.backend.repositories;

import iuh.fit.backend.entities.Order;
import iuh.fit.backend.entities.User;
import iuh.fit.backend.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find orders by user
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Find orders by user ID
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    // Find orders by status
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);
    
    // Find order by order number
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Find orders by date range
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    Page<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate, 
                               Pageable pageable);
    
    // Find orders by user and status
    Page<Order> findByUserAndStatusOrderByCreatedAtDesc(User user, OrderStatus status, Pageable pageable);
    
    // Count orders by status
    long countByStatus(OrderStatus status);
    
    // Count orders by user
    long countByUser(User user);
    
    // Search orders by order number or user info
    @Query("SELECT o FROM Order o WHERE " +
           "o.orderNumber LIKE %:keyword% OR " +
           "o.user.username LIKE %:keyword% OR " +
           "o.user.email LIKE %:keyword% OR " +
           "o.phoneNumber LIKE %:keyword% " +
           "ORDER BY o.createdAt DESC")
    Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);
    
    // Get orders with total amount greater than
    @Query("SELECT o FROM Order o WHERE o.totalAmount >= :minAmount ORDER BY o.createdAt DESC")
    Page<Order> findByTotalAmountGreaterThanEqual(@Param("minAmount") Double minAmount, Pageable pageable);
    
    // Get recent orders (last 30 days)
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :thirtyDaysAgo ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
    
    // Get orders statistics
    @Query("SELECT COUNT(o), SUM(o.totalAmount) FROM Order o WHERE o.status = :status")
    Object[] getOrderStatsByStatus(@Param("status") OrderStatus status);
}