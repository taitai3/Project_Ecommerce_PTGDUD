package iuh.fit.backend.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshResponse {
    
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    
    // Custom constructor for main fields
    public TokenRefreshResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}