import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import * as crypto from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private algorithm = 'aes-256-cbc'; // Symmetric encryption algorithm
  private key = 'mySecretKey'; // Encryption key (must be 32 bytes for AES-256)
  private iv = crypto.randomBytes(16); // Initialization vector (IV)
  constructor() {}

  public setNaclBoxKeyPair(keyPair: nacl.BoxKeyPair): void {
    const serializedKeyPair = JSON.stringify(keyPair);
    const setCookie = this.encrypt(serializedKeyPair);
    document.cookie = `paysolcookie=${encodeURIComponent(setCookie)}; Secure; HttpOnly`;
  }

  public getNaclBoxKeyPair(): nacl.BoxKeyPair | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'paysolcookie') {
        const serializedKeyPair = decodeURIComponent(value);
        const getValue = this.decrypt(serializedKeyPair)
        return JSON.parse(getValue) as nacl.BoxKeyPair;
      }
    }
    return null;
  }

    encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

    decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

}
