package iuh.fit.backend.services;

import iuh.fit.backend.dto.category.CategoryRequest;
import iuh.fit.backend.dto.category.CategoryResponse;
import iuh.fit.backend.entities.Category;
import iuh.fit.backend.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findAllActiveCategories()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        if (!category.getIsActive()) {
            throw new RuntimeException("Category is not active");
        }
        
        return convertToResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        // Check if category name already exists
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check if new name conflicts with existing category (excluding current one)
        if (!category.getName().equals(request.getName()) && 
            categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category with name '" + request.getName() + "' already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        Category updatedCategory = categoryRepository.save(category);
        return convertToResponse(updatedCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        // Check if category has products
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete category that has products. Please move or delete products first.");
        }
        
        // Soft delete
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    private CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setImageUrl(category.getImageUrl());
        response.setIsActive(category.getIsActive());
        response.setCreatedAt(category.getCreatedAt());
        
        // Count active products in this category
        int productCount = category.getProducts() != null ? 
            (int) category.getProducts().stream().filter(p -> p.getIsActive()).count() : 0;
        response.setProductCount(productCount);
        
        return response;
    }
}