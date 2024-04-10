import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {AppStaticGlobals} from "../../globals/AppStaticGlobals";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  public publicKey: string = "";
  constructor( private _router: Router ) { }
  async ngOnInit()
  {
    this.publicKey = AppStaticGlobals.pub_key;
  }
  disconnect = async () =>
  {
    AppStaticGlobals.DisConnect();
    window.location.reload();
  }
}
