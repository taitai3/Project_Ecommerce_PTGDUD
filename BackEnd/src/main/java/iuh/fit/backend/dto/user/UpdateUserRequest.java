package iuh.fit.backend.dto.user;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String fullName;
    private String phone;
    private String address;
    private Boolean active;
}
