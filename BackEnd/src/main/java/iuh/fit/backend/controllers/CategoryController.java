package iuh.fit.backend.controllers;

import iuh.fit.backend.dto.category.CategoryRequest;
import iuh.fit.backend.dto.category.CategoryResponse;
import iuh.fit.backend.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Public endpoints - accessible to everyone
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        try {
            List<CategoryResponse> categories = categoryService.getAllActiveCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        try {
            CategoryResponse category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin only endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            CategoryResponse category = categoryService.createCategory(request);
            return ResponseEntity.ok(category);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating category");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        try {
            CategoryResponse category = categoryService.updateCategory(id, request);
            return ResponseEntity.ok(category);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating category");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting category");
            return ResponseEntity.badRequest().body(error);
        }
    }
}