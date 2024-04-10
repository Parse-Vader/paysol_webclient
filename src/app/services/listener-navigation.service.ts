import {Injectable, NgZone} from '@angular/core';
import {App, URLOpenListenerEvent} from "@capacitor/app";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";
import {NavigationExtras, Router} from "@angular/router";
import {PhantomServiceService} from "./phantom-service.service";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {CookiesService} from "./cookies.service";

interface ConnectData {
  public_key: string;
  session: string;
}
@Injectable({
  providedIn: 'root'
})
export class ListenerNavigationService {

  public solAmount: string = "";
  public solSenderPubKey: string = "";
  public contract: string = "";
  public nano: string = "";
  constructor(
    private _phantomService: PhantomServiceService,
    private _router: Router,
    private _zone: NgZone,
    private  cookie: CookiesService
    ) { }

  public initializeListener() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this._zone.run(async () => {
        const url = new URL(event.url);

        if(event.url.startsWith('paysol://solsendertransaction'))
        {
          const pathParts = url.pathname.split('/');
          const amountIndex = pathParts.indexOf("amount") + 1;
          const pubkeyIndex = pathParts.indexOf("pub") + 1
          const contractIndex = pathParts.indexOf("con") + 1;
          const nanoIndex = pathParts.indexOf("nano") + 1;

          if (amountIndex > 0 && pubkeyIndex > 0 && pathParts.length > pubkeyIndex) {
            this.solAmount = pathParts[amountIndex];
            this.solSenderPubKey = pathParts[pubkeyIndex];
            this.contract = pathParts[contractIndex];
            this.nano = pathParts[nanoIndex];
            if(AppStaticGlobals.pub_key === "")
            {
                AppStaticGlobals.redirect = true;
            }
            else
            {
              this.HandleNavigation("//solsendertransaction", this.solAmount, this.solSenderPubKey, this.contract, this.nano);
            }
          }
        }

        if(event.url.startsWith('paysol://transactionstatus'))
        {
          const pathParts = url.pathname.split('/');
          const amountIndex = pathParts.indexOf("amount") + 1;
          const pubkeyIndex = pathParts.indexOf("pub") + 1;
          const contractIndex = pathParts.indexOf("con") + 1;
          const nanoIndex = pathParts.indexOf("nano") + 1;


          if (amountIndex > 0 && pubkeyIndex > 0 && pathParts.length > pubkeyIndex) {
            this.solAmount = pathParts[amountIndex];
            this.solSenderPubKey = pathParts[pubkeyIndex];
            this.contract = pathParts[contractIndex];
            this.nano = pathParts[nanoIndex];

            this.HandleNavigation("//transactionstatus", this.solAmount, this.solSenderPubKey, this.contract, this.nano);
          }
        }

        if (event.url.startsWith('paysol://places/payments')) {

          AppStaticGlobals.phantom_encryption_public_key = url.searchParams.get("phantom_encryption_public_key")!;

          const sharedSecretDapp = nacl.box.before(
            bs58.decode(url.searchParams.get("phantom_encryption_public_key")!),
            this.cookie.getNaclBoxKeyPair().secretKey
          );

          AppStaticGlobals.Data = url.searchParams.get("data")!;
          AppStaticGlobals.Nonce = url.searchParams.get("nonce")!;

          const connectData: ConnectData = this._phantomService.decryptPayload(
            url.searchParams.get("data")!,
            url.searchParams.get("nonce")!,
            sharedSecretDapp
          );

          AppStaticGlobals.pub_key = connectData.public_key;
          AppStaticGlobals.session = connectData.session;

          if(AppStaticGlobals.redirect)
          {
            await this._phantomService.signAndSendTransaction(parseFloat(this.solAmount), this.solSenderPubKey, parseInt(this.contract, 10), this.nano);
          }

          if (url.pathname.startsWith('/amount-')) {
            const matchAmount = url.pathname.match(/amount-(.*?)\/pub-(.*)/);
            if (matchAmount) {
              const amount = matchAmount[1];
              const pubkey = matchAmount[2];

              this.HandleNavigation('tx', amount, pubkey);
            }
          }
          this.HandleNavigation(url.pathname);
        }
      });
    });
  }

  private HandleNavigation(urlPath: string, solAmount: string = "", solSenderPubKey: string = "", contract: string = "", nano: string = "" ): void {
    switch (urlPath){
      case "places":
        this._router.navigateByUrl( 'payments').catch(error => {
        });
        break;
      case "connecting":
        this._router.navigateByUrl('places/payments');
        break;
      case "success":
        this._router.navigateByUrl('places/payments');
        break;
      case "//places/payments":
        this._router.navigateByUrl('places/payments').catch(error => {
        });
        break;
      case "//solsendertransaction":
        const queryParams: NavigationExtras = {
          queryParams: {
            amount: solAmount,
            key: solSenderPubKey,
            contract: contract,
            nano: nano
          }
        };
        this._router.navigate(['/solsendertransaction'], queryParams);
        break;
      case "//transactionstatus":
        const queryParamss: NavigationExtras = {
          queryParams: {
            amount: solAmount,
            key: solSenderPubKey,
            contract: contract,
            nano: nano
          }
        };
        this._router.navigate(['/transactionstatus'], queryParamss);
        break;
      default:
        this._router.navigateByUrl('places/payments');
        break;
    }
  }

}
