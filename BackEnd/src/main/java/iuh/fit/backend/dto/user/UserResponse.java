package iuh.fit.backend.dto.user;

import iuh.fit.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private Role role;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
