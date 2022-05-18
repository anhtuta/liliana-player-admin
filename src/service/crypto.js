import CryptoJS from 'crypto-js';

export const sha256Hex = (message) => {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
};

export const hmacSha512Hex = (message, key) => {
  return CryptoJS.HmacSHA512(message, key).toString(CryptoJS.enc.Hex);
};
