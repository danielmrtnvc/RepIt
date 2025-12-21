// Authentication utilities

const AUTH_KEY = 'repit_authenticated';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Set authentication status
 */
export function setAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

/**
 * Clear authentication (logout)
 */
export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

