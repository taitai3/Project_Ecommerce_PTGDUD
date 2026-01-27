package iuh.fit.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Custom constructor
    public RefreshToken(String token, LocalDateTime expiryDate, User user) {
        this.token = token;
        this.expiryDate = expiryDate;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    // Lifecycle callbacks
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Business logic method
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}