import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import * as crypto from 'crypto';
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  private algorithm = 'aes-256-cbc'; // Symmetric encryption algorithm
  private key = 'mySecretKey'; // Encryption key (must be 32 bytes for AES-256)
  private iv = window.crypto.getRandomValues(new Uint8Array(16));
  constructor(private cookieService: CookieService) {}

  public setNaclBoxKeyPair(keyPair: nacl.BoxKeyPair): void {
    const serializedKeyPair = JSON.stringify(keyPair);

    this.cookieService.set('paysolcookie', serializedKeyPair);
  }
  public getNaclBoxKeyPair(): nacl.BoxKeyPair {
    const cookieValue = this.cookieService.get('paysolcookie');

    return JSON.parse(cookieValue) as nacl.BoxKeyPair;
  }

  //   private encrypt(text: string): string {
  //   const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
  //   let encrypted = cipher.update(text, 'utf8', 'hex');
  //   encrypted += cipher.final('hex');
  //   return encrypted;
  // }
  //
  //   private decrypt(encryptedText: string): string {
  //   const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), this.iv);
  //   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  //   decrypted += decipher.final('utf8');
  //   return decrypted;
  // }

}
