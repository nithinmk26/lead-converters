/**
 * Security Authentication Engine
 * Features:
 * 1. SHA-256 Cryptographic Hash Verification (Zero plaintext credentials in source code / DevTools).
 * 2. SQL Injection Neutralizer & Strict Sanitizer.
 * 3. Session Auth State Guard.
 */

const SECURE_USER_HASH = '2c94b6d59adc73a950ee264388f6b70b37ad94135804e67c9a4e09364232e836';
const SECURE_PASS_HASH = 'a40d5f1140c35111e713d3cea63b9e48612ee90c1aca00d44c90b5e9d1c265b0';
const AUTH_SESSION_KEY = '_mw_session_token_sec';

/**
 * Compute SHA-256 Hash using native Web Crypto API
 */
export const sha256 = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * SQL Injection Detection & Neutralization
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Detect SQL injection attack patterns
  const sqlPattern = /('|"--|;|\/\*|\*\/|union\s+select|select\s+\*|or\s+1\s*=\s*1|drop\s+table|delete\s+from|insert\s+into)/i;
  if (sqlPattern.test(input)) {
    console.warn('SECURITY ALERT: SQL Injection Attempt Neutralized!');
  }
  
  // Strip dangerous SQL characters safely
  return input.replace(/['";\\-]/g, '');
};

/**
 * Authenticate User credentials safely
 */
export const authenticateUser = async (usernameInput, passwordInput) => {
  // 1. Sanitize against SQL Injection
  const cleanUser = sanitizeInput(usernameInput).trim();
  const cleanPass = passwordInput ? passwordInput.trim() : '';

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Please enter both Username and Password.' };
  }

  // 2. Hash inputs using Web Crypto SHA-256
  const userHash = await sha256(cleanUser);
  const passHash = await sha256(cleanPass);

  // 3. Compare SHA-256 Hashes
  if (userHash === SECURE_USER_HASH && passHash === SECURE_PASS_HASH) {
    const sessionToken = await sha256(cleanUser + cleanPass + Date.now().toString());
    sessionStorage.setItem(AUTH_SESSION_KEY, sessionToken);
    return { success: true };
  } else {
    return { success: false, error: 'Invalid Username or Password.' };
  }
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem(AUTH_SESSION_KEY);
};

export const logoutUser = () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};
