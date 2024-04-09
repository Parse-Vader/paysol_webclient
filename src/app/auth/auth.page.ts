import { ActivatedRoute, Router } from "@angular/router";
import { PhantomServiceService } from "../services/phantom-service.service";
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppStaticGlobals } from "../globals/AppStaticGlobals";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";
import { ConnectData } from "../interfaces/connect.data";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
  public link: string = '';
  public showSpinner: boolean = true;
  constructor(private _phantomService: PhantomServiceService, private _route: ActivatedRoute, private _router: Router) { }
  ngOnInit() {

  }

  connectIsClicked()
  {
    this._route.queryParams.subscribe(params => {
      const paramsLength = Object.keys(params).length;
      if (params['phantom_encryption_public_key'] || AppStaticGlobals.phantom_encryption_public_key !== "") {
        console.log("Does enter");
        this.handleResponse(params);
      } else {
        console.log('No public key found');
        this.Connect();
      }
    });
  }
  handleResponse( params: any ) {
    if (params['phantom_encryption_public_key']) {

      AppStaticGlobals.phantom_encryption_public_key = params['phantom_encryption_public_key'];

      try{
        const sharedDapSecret = nacl.box.before(
          bs58.decode(AppStaticGlobals.phantom_encryption_public_key),
          this._phantomService.getDapKeyPairSecret()
        );

        AppStaticGlobals.Data = params['data']!;
        AppStaticGlobals.Nonce = params['nonce']!;


        const connectData: ConnectData = this._phantomService.decryptPayload(
          AppStaticGlobals.Data,
          AppStaticGlobals.Nonce,
          sharedDapSecret
        ); // current error. unable to decrypt data

        AppStaticGlobals.pub_key = connectData.public_key;
        AppStaticGlobals.session = connectData.session;

        this._router.navigateByUrl('/solsendertransaction').catch(error => {
        });
      }

      catch (e) {
        alert(e);
      }

    }
  }
  Connect(): void {
    setTimeout(() => {
      this.showSpinner = false;
      this._phantomService.connect();
    }, 1000);
  }
}
