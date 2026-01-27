package iuh.fit.backend.config;

import iuh.fit.backend.entities.Category;
import iuh.fit.backend.entities.Product;
import iuh.fit.backend.entities.User;
import iuh.fit.backend.enums.Role;
import iuh.fit.backend.repositories.CategoryRepository;
import iuh.fit.backend.repositories.ProductRepository;
import iuh.fit.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

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

        // Create sample categories
        createSampleCategories();

        // Create sample products
        createSampleProducts();
    }

    private void createSampleCategories() {
        if (categoryRepository.count() == 0) {
            Category laptop = new Category("Laptop", "Máy tính xách tay các loại");
            laptop.setImageUrl("https://example.com/laptop.jpg");
            categoryRepository.save(laptop);

            Category smartphone = new Category("Smartphone", "Điện thoại thông minh");
            smartphone.setImageUrl("https://example.com/smartphone.jpg");
            categoryRepository.save(smartphone);

            Category tablet = new Category("Tablet", "Máy tính bảng");
            tablet.setImageUrl("https://example.com/tablet.jpg");
            categoryRepository.save(tablet);

            Category accessory = new Category("Accessories", "Phụ kiện công nghệ");
            accessory.setImageUrl("https://example.com/accessories.jpg");
            categoryRepository.save(accessory);

            System.out.println("Sample categories created");
        }
    }

    private void createSampleProducts() {
        if (productRepository.count() == 0) {
            Category laptop = categoryRepository.findByName("Laptop").orElse(null);
            Category smartphone = categoryRepository.findByName("Smartphone").orElse(null);
            Category tablet = categoryRepository.findByName("Tablet").orElse(null);
            Category accessory = categoryRepository.findByName("Accessories").orElse(null);

            if (laptop != null) {
                Product macbook = new Product("MacBook Pro 14", "Apple MacBook Pro 14 inch M3 chip", 
                    new BigDecimal("45000000"), 10, laptop);
                macbook.setBrand("Apple");
                macbook.setModel("MacBook Pro 14");
                macbook.setImageUrl("https://example.com/macbook-pro-14.jpg");
                macbook.setSpecifications("M3 chip, 16GB RAM, 512GB SSD");
                productRepository.save(macbook);

                Product dell = new Product("Dell XPS 13", "Dell XPS 13 Intel Core i7", 
                    new BigDecimal("25000000"), 15, laptop);
                dell.setBrand("Dell");
                dell.setModel("XPS 13");
                dell.setImageUrl("https://example.com/dell-xps-13.jpg");
                dell.setSpecifications("Intel Core i7, 16GB RAM, 512GB SSD");
                productRepository.save(dell);
            }

            if (smartphone != null) {
                Product iphone = new Product("iPhone 15 Pro", "Apple iPhone 15 Pro 128GB", 
                    new BigDecimal("28000000"), 20, smartphone);
                iphone.setBrand("Apple");
                iphone.setModel("iPhone 15 Pro");
                iphone.setImageUrl("https://example.com/iphone-15-pro.jpg");
                iphone.setSpecifications("A17 Pro chip, 128GB, Triple camera");
                productRepository.save(iphone);

                Product samsung = new Product("Samsung Galaxy S24", "Samsung Galaxy S24 Ultra 256GB", 
                    new BigDecimal("30000000"), 12, smartphone);
                samsung.setBrand("Samsung");
                samsung.setModel("Galaxy S24 Ultra");
                samsung.setImageUrl("https://example.com/galaxy-s24.jpg");
                samsung.setSpecifications("Snapdragon 8 Gen 3, 256GB, S Pen");
                productRepository.save(samsung);
            }

            if (tablet != null) {
                Product ipad = new Product("iPad Pro 11", "Apple iPad Pro 11 inch M4", 
                    new BigDecimal("22000000"), 8, tablet);
                ipad.setBrand("Apple");
                ipad.setModel("iPad Pro 11");
                ipad.setImageUrl("https://example.com/ipad-pro-11.jpg");
                ipad.setSpecifications("M4 chip, 256GB, 11-inch display");
                productRepository.save(ipad);
            }

            if (accessory != null) {
                Product airpods = new Product("AirPods Pro 2", "Apple AirPods Pro 2nd generation", 
                    new BigDecimal("6000000"), 25, accessory);
                airpods.setBrand("Apple");
                airpods.setModel("AirPods Pro 2");
                airpods.setImageUrl("https://example.com/airpods-pro-2.jpg");
                airpods.setSpecifications("Active Noise Cancellation, USB-C");
                productRepository.save(airpods);

                Product mouse = new Product("Logitech MX Master 3", "Logitech MX Master 3 Wireless Mouse", 
                    new BigDecimal("2500000"), 30, accessory);
                mouse.setBrand("Logitech");
                mouse.setModel("MX Master 3");
                mouse.setImageUrl("https://example.com/mx-master-3.jpg");
                mouse.setSpecifications("Wireless, Ergonomic, Multi-device");
                productRepository.save(mouse);
            }

            System.out.println("Sample products created");
        }
    }
}