import CryptoJS from 'crypto-js';

// Generate a consistent salt for each user (matches server-side generation)
export const generateUserSalt = (username: string): string => {
  return CryptoJS.SHA256(username + 'server-salt').toString().substring(0, 16);
};

// Hash password with salt using SHA-256
export const hashPassword = (password: string, salt: string): string => {
  return CryptoJS.SHA256(password + salt).toString();
};

// Generate a random salt for additional security (not used in current implementation)
export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString();
};
