package iuh.fit.backend.controllers;

import iuh.fit.backend.services.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quickfix")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuickFixController {

    @Autowired
    private DataSource dataSource;

    @Autowired(required = false)
    private CloudinaryService cloudinaryService;

    @GetMapping("/cloudinary-test")
    public ResponseEntity<?> testCloudinary() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test Cloudinary connection
            if (cloudinaryService != null) {
                response.put("cloudinaryService", "Available");
            } else {
                response.put("cloudinaryService", "Not available");
            }
            
            // Check configuration values
            response.put("cloudName", System.getProperty("cloudinary.cloud-name", "Not found"));
            response.put("apiKey", System.getProperty("cloudinary.api-key", "Not found"));
            
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/database")
    public ResponseEntity<?> fixDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            
            // Fix categories table
            statement.executeUpdate("ALTER TABLE categories MODIFY COLUMN image_url VARCHAR(1000)");
            
            // Fix products table
            statement.executeUpdate("ALTER TABLE products MODIFY COLUMN image_url VARCHAR(1000)");
            
            response.put("status", "success");
            response.put("message", "Database fixed! image_url columns updated to VARCHAR(1000)");
            response.put("categories", "Fixed");
            response.put("products", "Fixed");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}