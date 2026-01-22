package iuh.fit.backend.repositories;

import iuh.fit.backend.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByCartId(Long cartId);
    
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.id = :userId")
    List<CartItem> findByUserId(@Param("userId") Long userId);
    
    void deleteByCartId(Long cartId);
    
    void deleteByCartIdAndProductId(Long cartId, Long productId);
}