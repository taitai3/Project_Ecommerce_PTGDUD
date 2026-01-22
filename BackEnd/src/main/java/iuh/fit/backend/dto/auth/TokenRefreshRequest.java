package iuh.fit.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class TokenRefreshRequest {
    
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
    
    // Constructors
    public TokenRefreshRequest() {}
    
    public TokenRefreshRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    // Getters and Setters
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}