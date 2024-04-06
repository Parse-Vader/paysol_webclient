import { Injectable } from '@angular/core';
import {AppStaticGlobals} from "../globals/AppStaticGlobals";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public async getAuthenticationState(): Promise<boolean> {
    const my_public_key = AppStaticGlobals.pub_key;
    return my_public_key !== "";
  }
}
