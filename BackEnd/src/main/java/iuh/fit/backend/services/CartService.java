package iuh.fit.backend.services;

import iuh.fit.backend.dto.cart.CartItemRequest;
import iuh.fit.backend.dto.cart.CartItemResponse;
import iuh.fit.backend.dto.cart.CartResponse;
import iuh.fit.backend.entities.Cart;
import iuh.fit.backend.entities.CartItem;
import iuh.fit.backend.entities.Product;
import iuh.fit.backend.entities.User;
import iuh.fit.backend.repositories.CartItemRepository;
import iuh.fit.backend.repositories.CartRepository;
import iuh.fit.backend.repositories.ProductRepository;
import iuh.fit.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public CartResponse getOrCreateCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        
        return mapToCartResponse(cart);
    }
    
    @Transactional
    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }
        
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(new CartItem());
        
        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        }
        
        cartItemRepository.save(cartItem);
        
        return mapToCartResponse(cart);
    }
    
    @Transactional
    public CartResponse updateCartItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user");
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            if (cartItem.getProduct().getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        
        return mapToCartResponse(cart);
    }
    
    @Transactional
    public void removeItemFromCart(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        cartItemRepository.deleteByCartId(cart.getId());
    }
    
    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        
        List<CartItemResponse> itemResponses = items.stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());
        
        double totalAmount = itemResponses.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();
        
        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();
        
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemResponses)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }
    
    private CartItemResponse mapToCartItemResponse(CartItem item) {
        Double price = item.getProduct().getPrice().doubleValue();
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .price(price)
                .quantity(item.getQuantity())
                .subtotal(price * item.getQuantity())
                .build();
    }
}
