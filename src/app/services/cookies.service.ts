import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import * as crypto from 'crypto';
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor(private cookieService: CookieService) {}

  public setNaclBoxKeyPair(keyPair: nacl.BoxKeyPair): void {
    const serializedKeyPair = JSON.stringify(keyPair);
    this.cookieService.set('paysolcookie', serializedKeyPair);
  }
  public getNaclBoxKeyPair(): nacl.BoxKeyPair {
    const cookieValue = this.cookieService.get('paysolcookie');
    console.log(cookieValue);
    if(cookieValue)
    {
      const deserializedKeyPair = JSON.parse(cookieValue) as nacl.BoxKeyPair;

      // Convert publicKey object to Uint8Array
      if (deserializedKeyPair.publicKey && typeof deserializedKeyPair.publicKey === 'object') {
        const publicKeyBytes = Object.values(deserializedKeyPair.publicKey);
        deserializedKeyPair.publicKey = new Uint8Array(publicKeyBytes);
      }

      if (deserializedKeyPair.secretKey && typeof deserializedKeyPair.secretKey === 'object') {
        const secretKeyBytes = Object.values(deserializedKeyPair.secretKey);
        deserializedKeyPair.secretKey = new Uint8Array(secretKeyBytes);
      }

      console.log("type checker: " + typeof deserializedKeyPair.publicKey);
      console.log("length: " + deserializedKeyPair.publicKey.length);
      console.log("publickey: " +  deserializedKeyPair.publicKey);
      return deserializedKeyPair;
    }

    return null!;
  }

}
