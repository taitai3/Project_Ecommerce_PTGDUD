package iuh.fit.backend.controllers;

import iuh.fit.backend.dto.product.ProductRequest;
import iuh.fit.backend.dto.product.ProductResponse;
import iuh.fit.backend.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    // Public endpoints - accessible to everyone
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        try {
            List<ProductResponse> products = productService.getAllActiveProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/page")
    public ResponseEntity<Page<ProductResponse>> getAllProductsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<ProductResponse> products = productService.getAllActiveProducts(pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        try {
            List<ProductResponse> products = productService.getProductsByCategory(categoryId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductResponse> products = productService.searchProducts(keyword, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        try {
            List<String> brands = productService.getAllBrands();
            return ResponseEntity.ok(brands);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin only endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request) {
        try {
            ProductResponse product = productService.createProduct(request);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating product");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        try {
            ProductResponse product = productService.updateProduct(id, request);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating product");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting product");
            return ResponseEntity.badRequest().body(error);
        }
    }
}