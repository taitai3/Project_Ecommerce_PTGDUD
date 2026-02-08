package iuh.fit.backend.controllers;

import iuh.fit.backend.dto.cart.CartItemRequest;
import iuh.fit.backend.dto.cart.CartResponse;
import iuh.fit.backend.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @Valid @RequestBody CartItemRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.addItemToCart(userId, request);
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.updateCartItem(userId, itemId, quantity);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        cartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
    
    private Long getUserIdFromAuth(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // Assuming username is the user ID or you need to fetch from UserRepository
        return Long.parseLong(userDetails.getUsername());
    }
}
