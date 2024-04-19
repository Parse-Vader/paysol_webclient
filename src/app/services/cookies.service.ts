import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import * as crypto from 'crypto';
import {CookieService} from "ngx-cookie-service";
import { ncrypt } from "ncrypt-js"
import {Keypair} from "@solana/web3.js";
import {ClientRequestService} from "./client-request.service";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {TransactionModel} from "../interfaces/transaction.model";
import {Contract} from "../interfaces/contract.enum";


@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  public _secretKey: string = '';
  constructor(private cookieService: CookieService, private _clientRequest: ClientRequestService) {}

  public setTxNanoIdCookie(txNanoId: string): void {
    this.cookieService.set('nanocookie', txNanoId);
  }

  public getTxNanoIdCookie(): string {
    return this.cookieService.get('nanocookie');
  }

  public setNaclBoxKeyPair(keyPair: nacl.BoxKeyPair) {
    // const _secretkey = this._clientRequest.getSecretKey();
    this._clientRequest.getSecretKey().subscribe(
      (data: string) => {
        this._secretKey = data;
        const {encrypt, decrypt} = new ncrypt(this._secretKey);
        const encryptedKeypair = encrypt(this._secretKey);
        this.cookieService.set('paysolcookie', encryptedKeypair);
      },
      (error) => console.error(error)
    );
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

}
