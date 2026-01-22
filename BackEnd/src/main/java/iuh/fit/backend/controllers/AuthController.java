package iuh.fit.backend.controllers;

import iuh.fit.backend.dto.auth.*;
import iuh.fit.backend.entities.RefreshToken;
import iuh.fit.backend.entities.User;
import iuh.fit.backend.enums.Role;
import iuh.fit.backend.repositories.UserRepository;
import iuh.fit.backend.services.RefreshTokenService;
import iuh.fit.backend.utils.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User userDetails = (User) authentication.getPrincipal();
            String jwt = jwtUtils.generateTokenWithRole(userDetails, userDetails.getRole().name());
            
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    refreshToken.getToken(),
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getFullName(),
                    userDetails.getRole().name()));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            response.put("message", "Error: Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            response.put("message", "Error: Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFullName(),
                Role.USER);

        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setAddress(signUpRequest.getAddress());

        userRepository.save(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();

            UserProfileResponse profile = new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhoneNumber(),
                    user.getAddress(),
                    user.getRole().name(),
                    user.getCreatedAt()
            );

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error retrieving user profile");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenWithRole(user, user.getRole().name());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();
            
            refreshTokenService.deleteByUser(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Log out successful!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error during logout");
            return ResponseEntity.badRequest().body(error);
        }
    }
}