package iuh.fit.backend.repositories;

import iuh.fit.backend.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByIsActive(Boolean isActive);
    
    List<Product> findByCategoryId(Long categoryId);
    
    List<Product> findByCategoryIdAndIsActive(Long categoryId, Boolean isActive);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    List<Product> findAllActiveProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    Page<Product> findAllActiveProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    Page<Product> findByCategoryIdAndIsActive(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE " +
           "p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE " +
           "p.isActive = true AND " +
           "p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                  @Param("maxPrice") BigDecimal maxPrice, 
                                  Pageable pageable);
    
    List<Product> findByBrandAndIsActive(String brand, Boolean isActive);
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true ORDER BY p.brand")
    List<String> findAllActiveBrands();
}