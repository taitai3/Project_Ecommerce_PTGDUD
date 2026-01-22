package iuh.fit.backend.config;

import iuh.fit.backend.entities.User;
import iuh.fit.backend.enums.Role;
import iuh.fit.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullName("System Administrator");
            admin.setRole(Role.ADMIN);
            admin.setPhoneNumber("0123456789");
            admin.setAddress("Tech Store HQ");
            
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/123456");
        }

        // Create default user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@gmail.com");
            user.setPassword(passwordEncoder.encode("123456"));
            user.setFullName("Test User");
            user.setRole(Role.USER);
            user.setPhoneNumber("0987654321");
            user.setAddress("User Address");
            
            userRepository.save(user);
            System.out.println("Default user created: user/123456");
        }
    }
}