package iuh.fit.backend.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    
    // Custom constructor for main fields
    public JwtResponse(String accessToken, String refreshToken, Long id, String username, String email, String fullName, String role) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }
}