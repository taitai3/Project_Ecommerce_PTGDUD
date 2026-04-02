package iuh.fit.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/fix")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DatabaseFixController {

    @Autowired
    private DataSource dataSource;

    @PostMapping("/image-url-length")
    public ResponseEntity<?> fixImageUrlLength() {
        Map<String, String> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            
            // Fix categories table
            statement.executeUpdate("ALTER TABLE categories MODIFY COLUMN image_url VARCHAR(1000)");
            response.put("categories", "Updated image_url to VARCHAR(1000)");
            
            // Fix products table
            statement.executeUpdate("ALTER TABLE products MODIFY COLUMN image_url VARCHAR(1000)");
            response.put("products", "Updated image_url to VARCHAR(1000)");
            
            response.put("status", "success");
            response.put("message", "Database schema updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update database: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}