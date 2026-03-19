// Authentication utility functions

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const setTokens = (token, refreshToken) => {
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user'); // Clear user info if stored
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      username: payload.sub,
      role: payload.role,
      exp: payload.exp
    };
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  clearTokens();
  // Redirect to login page
  window.location.href = '/login';
};