import { ActivatedRoute, Router } from "@angular/router";
import { PhantomServiceService } from "../services/phantom-service.service";
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppStaticGlobals } from "../globals/AppStaticGlobals";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";
import { ConnectData } from "../interfaces/connect.data";
import {CookiesService} from "../services/cookies.service";
export enum WalletType {
  PHANTOM = 'phantom',
  SOLFLARE = 'solflare'
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
  public link: string = '';
  constructor(private _phantomService: PhantomServiceService, private _route: ActivatedRoute, private _router: Router, private _cookieService: CookiesService) { }
  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      const paramsLength = Object.keys(params).length;
      if (params['phantom_encryption_public_key'] || params['solflare_encryption_public_key'] ) {
        this.handleResponse(params);
      }
    });
  }

  protected handleChange(e : any){
    AppStaticGlobals.setWalletSettings(e.detail.value);
    this.connectIsClicked();
  }

  private connectIsClicked()
  {
        this.Connect();
  }
  handleResponse( params: any ) {

    if (params['phantom_encryption_public_key'] || params['solflare_encryption_public_key'] ) {
      AppStaticGlobals.wallet_encryption_public_key
        = params['phantom_encryption_public_key']
        ?? params['solflare_encryption_public_key'] ;

      params['phantom_encryption_public_key']
        ? AppStaticGlobals.setWalletSettings(WalletType.PHANTOM)
        : AppStaticGlobals.setWalletSettings(WalletType.SOLFLARE);

      try{
        const sharedDapSecret = nacl.box.before(
          bs58.decode(AppStaticGlobals.wallet_encryption_public_key),
          this._phantomService.getDapKeyPairSecret()
        );

        AppStaticGlobals.Data = params['data']!;
        AppStaticGlobals.Nonce = params['nonce']!;


        const connectData: ConnectData = this._phantomService.decryptPayload(
          AppStaticGlobals.Data,
          AppStaticGlobals.Nonce,
          sharedDapSecret
        );

        AppStaticGlobals.pub_key = connectData.public_key;
        AppStaticGlobals.session = connectData.session;

        AppStaticGlobals.txNanoId = this._cookieService.getTxNanoIdCookie();

        if(AppStaticGlobals.txNanoId != "")
        {
          this._router.navigateByUrl('/solsendertransaction').catch(error => {
          });
        }
      }
      catch (e) {
      }
    }
  }

  Connect(): void {
    this._phantomService.connect();
  }
}


