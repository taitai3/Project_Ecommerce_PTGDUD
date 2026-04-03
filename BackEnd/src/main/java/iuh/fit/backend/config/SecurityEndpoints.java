package iuh.fit.backend.config;

public class SecurityEndpoints {
    
    // Public endpoints - no authentication required
    public static final String[] PUBLIC_ENDPOINTS = {
        "/auth/**",
        "/api/auth/**",
        "/api/categories/**",  // Temporary public access
        "/api/products/**",    // Temporary public access
        "/api/upload/**",      // Temporary public access for testing
        "/api/files/**",       // File serving
        "/**"                  // Temporary: Allow all endpoints for testing
    };
    
    // Public GET endpoints - read-only access
    public static final String[] PUBLIC_GET_ENDPOINTS = {
        "/api/categories/**",
        "/api/products/**"
    };
    
    // Admin only endpoints - full CRUD access
    public static final String[] ADMIN_ENDPOINTS = {
        "/admin/**",
        "/api/users/**",
        "/api/upload/**",      // File upload
        "/api/orders/stats",   // Order statistics
        "/api/orders/user/**"  // View orders by user ID
    };
    
    // Admin POST endpoints - create operations
    public static final String[] ADMIN_POST_ENDPOINTS = {
        "/api/categories/**",
        "/api/products/**"
    };
    
    // Admin PUT endpoints - update operations  
    public static final String[] ADMIN_PUT_ENDPOINTS = {
        "/api/categories/**",
        "/api/products/**",
        "/api/orders/*/status" // Update order status
    };
    
    // Admin DELETE endpoints - delete operations
    public static final String[] ADMIN_DELETE_ENDPOINTS = {
        "/api/categories/**",
        "/api/products/**"
    };
    
    // User endpoints - authenticated users (both USER and ADMIN roles)
    public static final String[] USER_ENDPOINTS = {
        "/api/cart/**",
        "/api/orders/**"       // All order operations for authenticated users
    };
}