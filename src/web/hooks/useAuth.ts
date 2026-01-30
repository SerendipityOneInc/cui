import { useEffect } from 'react';

const AUTH_STORAGE_KEY = 'cui-auth-token';

/**
 * Validate token format (32 character hex string)
 */
function isValidToken(token: string): boolean {
  return token.length === 32 && /^[a-f0-9]+$/.test(token);
}

/**
 * Get auth token from sessionStorage
 */
export function getAuthToken(): string | null {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    // sessionStorage may not be available in some contexts
    return null;
  }
}

/**
 * Set auth token in sessionStorage
 */
export function setAuthToken(token: string): void {
  try {
    sessionStorage.setItem(AUTH_STORAGE_KEY, token);
  } catch {
    console.warn('Failed to store auth token in sessionStorage');
  }
}

/**
 * Clear auth token from sessionStorage
 */
export function clearAuthToken(): void {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Extract token from URL (supports both fragment and query parameter)
 * Priority: fragment (#token=xxx) > query parameter (?token=xxx)
 */
function extractTokenFromUrl(): string | null {
  // 1. Check fragment first (more secure, preferred)
  const fragment = window.location.hash;
  if (fragment.startsWith('#token=')) {
    const token = fragment.substring(7); // Remove '#token='
    if (isValidToken(token)) {
      return token;
    }
    console.warn('Invalid token format in URL fragment');
  }

  // 2. Check query parameter (useful for programmatic access)
  const params = new URLSearchParams(window.location.search);
  const queryToken = params.get('token');
  if (queryToken) {
    if (isValidToken(queryToken)) {
      return queryToken;
    }
    console.warn('Invalid token format in URL query parameter');
  }

  return null;
}

/**
 * Clear token from URL (both fragment and query parameter)
 */
function clearTokenFromUrl(): void {
  const url = new URL(window.location.href);
  let needsUpdate = false;

  // Clear fragment if it contains token
  if (url.hash.startsWith('#token=')) {
    url.hash = '';
    needsUpdate = true;
  }

  // Clear query parameter if it contains token
  if (url.searchParams.has('token')) {
    url.searchParams.delete('token');
    needsUpdate = true;
  }

  if (needsUpdate && window.history && window.history.replaceState) {
    // Build clean URL
    let cleanUrl = url.pathname;
    if (url.searchParams.toString()) {
      cleanUrl += '?' + url.searchParams.toString();
    }
    window.history.replaceState(null, '', cleanUrl);
  }
}

/**
 * Hook for handling authentication token extraction and storage
 */
export function useAuth(): void {
  useEffect(() => {
    // Check if token exists in URL
    const urlToken = extractTokenFromUrl();

    if (urlToken) {
      // Store token in sessionStorage
      setAuthToken(urlToken);

      // Clear token from URL for security
      clearTokenFromUrl();

      console.log('Authentication token stored successfully');
    }
  }, []);
}
