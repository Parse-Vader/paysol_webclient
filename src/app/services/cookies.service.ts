import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import * as crypto from 'crypto';
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor(private cookieService: CookieService) {}

  public setTxNanoIdCookie(txNanoId: string): void {
    this.cookieService.set('nanocookie', txNanoId);
  }

  public getTxNanoIdCookie(): string {
    return this.cookieService.get('nanocookie');
  }
  public setNaclBoxKeyPair(keyPair: nacl.BoxKeyPair): void {
    const serializedKeyPair = JSON.stringify(keyPair);
    const currentTime = new Date();
    const expireTime = new Date(currentTime.getTime() + 30 * 1000);
    this.cookieService.set('paysolcookie', serializedKeyPair, { expires: expireTime });
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

    alert("Paysol session expired please try again");
    return nacl.box.keyPair();
  }

}
