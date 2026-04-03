package iuh.fit.backend.services;

import iuh.fit.backend.dto.order.*;
import iuh.fit.backend.entities.*;
import iuh.fit.backend.enums.OrderStatus;
import iuh.fit.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    /**
     * Create order from user's cart
     */
    @Transactional
    public OrderResponse createOrderFromCart(Long userId, CreateOrderRequest request) {
        log.info("Creating order from cart for user: {}", userId);
        
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get user's cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        // Get cart items
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Validate stock and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // Check stock availability
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                                         ". Available: " + product.getStockQuantity() + ", Required: " + cartItem.getQuantity());
            }
            
            // Calculate total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setNotes(request.getNotes());
        order.setStatus(OrderStatus.PENDING);
        
        // Save order
        order = orderRepository.save(order);
        
        // Create order items and update product stock
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.calculateTotalPrice();
            
            orderItemRepository.save(orderItem);
            
            // Reserve stock (decrease when order is created)
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        // Clear cart after successful order creation
        cartItemRepository.deleteAll(cartItems);
        
        log.info("Order created successfully: {}", order.getOrderNumber());
        return mapToOrderResponse(order, true);
    }
    
    /**
     * Get all orders with pagination (Admin)
     */
    public Page<OrderResponse> getAllOrders(int page, int size, String status, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders;
        
        if (search != null && !search.trim().isEmpty()) {
            orders = orderRepository.searchOrders(search.trim(), pageable);
        } else if (status != null && !status.trim().isEmpty()) {
            try {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orders = orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus, pageable);
            } catch (IllegalArgumentException e) {
                orders = orderRepository.findAll(pageable);
            }
        } else {
            orders = orderRepository.findAll(pageable);
        }
        
        return orders.map(order -> mapToOrderResponse(order, false));
    }
    
    /**
     * Get orders by user (Customer)
     */
    public Page<OrderResponse> getOrdersByUser(Long userId, int page, int size, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders;
        
        if (status != null && !status.trim().isEmpty()) {
            try {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orders = orderRepository.findByUserAndStatusOrderByCreatedAtDesc(user, orderStatus, pageable);
            } catch (IllegalArgumentException e) {
                orders = orderRepository.findByUserOrderByCreatedAtDesc(user, pageable);
            }
        } else {
            orders = orderRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }
        
        return orders.map(order -> mapToOrderResponse(order, false));
    }
    
    /**
     * Get order by ID
     */
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        return mapToOrderResponse(order, true);
    }
    
    /**
     * Get order by order number
     */
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        return mapToOrderResponse(order, true);
    }
    
    /**
     * Update order status (Admin only)
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        log.info("Updating order status: {} to {}", orderId, request.getStatus());
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();
        
        // Validate status transition
        validateStatusTransition(oldStatus, newStatus);
        
        // Handle stock changes based on status
        handleStockChanges(order, oldStatus, newStatus);
        
        // Update order
        order.setStatus(newStatus);
        if (request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
            order.setNotes(order.getNotes() + "\n[" + LocalDateTime.now() + "] " + request.getNotes());
        }
        
        order = orderRepository.save(order);
        
        log.info("Order status updated successfully: {} -> {}", oldStatus, newStatus);
        return mapToOrderResponse(order, true);
    }
    
    /**
     * Cancel order
     */
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if user owns this order (for customer cancellation)
        if (userId != null && !order.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        // Check if order can be cancelled
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel order that has been shipped or delivered");
        }
        
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }
        
        // Restore stock
        restoreStock(order);
        
        // Update status
        order.setStatus(OrderStatus.CANCELLED);
        order.setNotes(order.getNotes() + "\n[" + LocalDateTime.now() + "] Order cancelled");
        
        order = orderRepository.save(order);
        
        log.info("Order cancelled successfully: {}", order.getOrderNumber());
        return mapToOrderResponse(order, true);
    }
    
    /**
     * Get order statistics
     */
    public OrderStatsResponse getOrderStats() {
        OrderStatsResponse stats = new OrderStatsResponse();
        
        stats.setTotalOrders(orderRepository.count());
        stats.setPendingOrders(orderRepository.countByStatus(OrderStatus.PENDING));
        stats.setConfirmedOrders(orderRepository.countByStatus(OrderStatus.CONFIRMED));
        stats.setProcessingOrders(orderRepository.countByStatus(OrderStatus.PROCESSING));
        stats.setShippedOrders(orderRepository.countByStatus(OrderStatus.SHIPPED));
        stats.setDeliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED));
        stats.setCancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED));
        
        // Calculate revenue (you might want to add these queries to repository)
        List<Order> allOrders = orderRepository.findAll();
        stats.setTotalRevenue(allOrders.stream()
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum());
        
        stats.setPendingRevenue(allOrders.stream()
                .filter(order -> order.getStatus() == OrderStatus.PENDING)
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum());
        
        stats.setCompletedRevenue(allOrders.stream()
                .filter(order -> order.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum());
        
        return stats;
    }
    
    // Helper methods
    
    private void validateStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {
        // Define valid transitions
        switch (oldStatus) {
            case PENDING:
                if (newStatus != OrderStatus.CONFIRMED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PENDING to " + newStatus);
                }
                break;
            case CONFIRMED:
                if (newStatus != OrderStatus.PROCESSING && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from CONFIRMED to " + newStatus);
                }
                break;
            case PROCESSING:
                if (newStatus != OrderStatus.SHIPPED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PROCESSING to " + newStatus);
                }
                break;
            case SHIPPED:
                if (newStatus != OrderStatus.DELIVERED) {
                    throw new RuntimeException("Invalid status transition from SHIPPED to " + newStatus);
                }
                break;
            case DELIVERED:
            case CANCELLED:
                throw new RuntimeException("Cannot change status of " + oldStatus + " order");
        }
    }
    
    private void handleStockChanges(Order order, OrderStatus oldStatus, OrderStatus newStatus) {
        // If cancelling, restore stock
        if (newStatus == OrderStatus.CANCELLED) {
            restoreStock(order);
        }
        // Stock is already reserved when order is created, no additional changes needed for other transitions
    }
    
    private void restoreStock(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productRepository.save(product);
        }
    }
    
    private OrderResponse mapToOrderResponse(Order order, boolean includeItems) {
        OrderResponse response = new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getUser().getEmail(),
                order.getTotalAmount().doubleValue(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getPhoneNumber(),
                order.getNotes(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
        
        if (includeItems) {
            List<OrderItem> orderItems = orderItemRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
            List<OrderItemResponse> itemResponses = orderItems.stream()
                    .map(this::mapToOrderItemResponse)
                    .collect(Collectors.toList());
            response.setOrderItems(itemResponses);
            response.setTotalItems(orderItems.size());
        }
        
        return response;
    }
    
    private OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getProduct().getName(),
                orderItem.getProduct().getImageUrl(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice().doubleValue(),
                orderItem.getTotalPrice().doubleValue(),
                orderItem.getCreatedAt()
        );
    }
}