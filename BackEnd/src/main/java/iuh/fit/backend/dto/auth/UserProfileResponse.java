package iuh.fit.backend.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String role;
    private LocalDateTime createdAt;
}