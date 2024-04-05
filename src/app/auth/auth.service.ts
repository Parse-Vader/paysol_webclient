import { Injectable } from '@angular/core';
import {NavController} from "@ionic/angular";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected hasKey: boolean = false;
  constructor( private _navCtrl: NavController) {
  }
  public async getAuthenticationState(): Promise<boolean> {
    const my_public_key = AppStaticGlobals.pub_key;
    this.hasKey = my_public_key !== "";
    return this.hasKey;
  }
}
