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

    return JSON.parse(cookieValue) as nacl.BoxKeyPair;
  }

}
