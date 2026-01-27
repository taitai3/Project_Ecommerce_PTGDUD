package iuh.fit.backend.services;

import iuh.fit.backend.dto.product.ProductRequest;
import iuh.fit.backend.dto.product.ProductResponse;
import iuh.fit.backend.entities.Category;
import iuh.fit.backend.entities.Product;
import iuh.fit.backend.repositories.CategoryRepository;
import iuh.fit.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findAllActiveProducts()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> getAllActiveProducts(Pageable pageable) {
        return productRepository.findAllActiveProducts(pageable)
                .map(this::convertToResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        if (!product.getIsActive()) {
            throw new RuntimeException("Product is not active");
        }
        
        return convertToResponse(product);
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActive(categoryId, true)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsActive(categoryId, pageable)
                .map(this::convertToResponse);
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable)
                .map(this::convertToResponse);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setModel(request.getModel());
        product.setSpecifications(request.getSpecifications());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setModel(request.getModel());
        product.setSpecifications(request.getSpecifications());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Soft delete
        product.setIsActive(false);
        productRepository.save(product);
    }

    public List<String> getAllBrands() {
        return productRepository.findAllActiveBrands();
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setImageUrl(product.getImageUrl());
        response.setBrand(product.getBrand());
        response.setModel(product.getModel());
        response.setSpecifications(product.getSpecifications());
        response.setIsActive(product.getIsActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setCategoryId(product.getCategory().getId());
        response.setCategoryName(product.getCategory().getName());
        return response;
    }
}