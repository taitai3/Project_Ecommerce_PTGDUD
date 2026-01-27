package iuh.fit.backend.dto.category;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Integer productCount;
}