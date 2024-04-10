import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import {CookieService} from "ngx-cookie-service";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";

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
    if(cookieValue)
    {
      const deserializedKeyPair = JSON.parse(cookieValue) as nacl.BoxKeyPair;

      if (deserializedKeyPair.publicKey && typeof deserializedKeyPair.publicKey === 'object') {
        const publicKeyBytes = Object.values(deserializedKeyPair.publicKey);
        deserializedKeyPair.publicKey = new Uint8Array(publicKeyBytes);
      }

      if (deserializedKeyPair.secretKey && typeof deserializedKeyPair.secretKey === 'object') {
        const secretKeyBytes = Object.values(deserializedKeyPair.secretKey);
        deserializedKeyPair.secretKey = new Uint8Array(secretKeyBytes);
      }
      return deserializedKeyPair;
    }
    return null!;
  }

  public deleteCookie(){
    this.cookieService.deleteAll();
    AppStaticGlobals.DisConnect();
  }
}
