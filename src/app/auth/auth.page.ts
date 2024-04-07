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
    this._route.queryParams.subscribe(params => {
      if (params['phantom_encryption_public_key']) {
        this.handleResponse(params);
      } else {
        alert(this._phantomService.getDapKeyPair());
        this.Connect();
      }
    });
  }
  handleResponse( params: any ) {
    if (params['phantom_encryption_public_key']) {
      alert(this._phantomService.getDapKeyPair());

      AppStaticGlobals.phantom_encryption_public_key = params['phantom_encryption_public_key'];
     const sharedDapSecret = nacl.box.before(
        bs58.decode(AppStaticGlobals.phantom_encryption_public_key!),
        this._phantomService.getDapKeyPair()
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
      alert('your publickey: ' + AppStaticGlobals.phantom_encryption_public_key);
      this._router.navigateByUrl('places/payments');
    }
  }
  Connect(): void {
    setTimeout(() => {
      this.showSpinner = false;
      this._phantomService.connect();
    }, 1000);
  }
}
