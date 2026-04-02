package iuh.fit.backend.controllers;

import iuh.fit.backend.services.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/simple-upload")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SimpleUploadController {

    @Autowired(required = false)
    private CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("error", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("error", "Only image files are allowed");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("error", "File size must be less than 5MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Upload to Cloudinary
            if (cloudinaryService != null) {
                String fileUrl = cloudinaryService.uploadImage(file);
                response.put("url", fileUrl);
                response.put("storage", "cloudinary");
                response.put("originalName", file.getOriginalFilename());
                response.put("size", String.valueOf(file.getSize()));
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Cloudinary service not available");
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            response.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}