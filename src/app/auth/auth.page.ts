import { ActivatedRoute, Router } from "@angular/router";
import { PhantomServiceService } from "../services/phantom-service.service";
import {Component, OnInit} from '@angular/core';
import { AppStaticGlobals } from "../globals/AppStaticGlobals";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";
import { ConnectData } from "../interfaces/connect.data";
import {CookiesService} from "../services/cookies.service";
import {RealtimeServerPriceService} from "../services/realtime-server-price.service";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
  public link: string = '';
  public showSpinner: boolean = true;
  public response: string = '';

  constructor(private _phantomService: PhantomServiceService,
              private _route: ActivatedRoute,
              private _router: Router,
              private cookie: CookiesService,
              private _realtime: RealtimeServerPriceService
              ) { }

  async ngOnInit() {
    // this.response = await this._realtime.funcArray();
  }

  connectIsClicked()
  {
    this._route.queryParams.subscribe(params => {
      if (params['phantom_encryption_public_key']) { //|| AppStaticGlobals.phantom_encryption_public_key !== ""
        this.handleResponse(params);
      } else {
        this.Connect();
      }
    });
  }
  handleResponse( params: any ) {
    if (params['phantom_encryption_public_key']) {
      alert(this.cookie.getNaclBoxKeyPair().secretKey);
      AppStaticGlobals.phantom_encryption_public_key = params['phantom_encryption_public_key'];
        const sharedDapSecret = nacl.box.before(
          bs58.decode(AppStaticGlobals.phantom_encryption_public_key),
          this.cookie.getNaclBoxKeyPair().secretKey
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

        this._router.navigateByUrl('places/payments');
    }
  }
  Connect(): void {
      this.showSpinner = false;
      this._phantomService.connect();
  }
}
