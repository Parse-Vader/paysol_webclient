import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from "@ionic/angular";
import {Contract} from "../interfaces/contract.enum";
import {TransactionModel} from "../interfaces/transaction.model";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {ClientRequestService} from "../services/client-request.service";
import {CookiesService} from "../services/cookies.service";

@Component({
  selector: 'app-transactionstatus',
  templateUrl: './transactionstatus.page.html',
  styleUrls: ['./transactionstatus.page.scss'],
})
export class TransactionstatusPage implements OnInit {
  public amount: string = '';
  public key: string = '';
  public contract: number = 0;
  public nano: string = '';
  public nameContranct: string = '';
  public transaction: TransactionModel = {id: "", contract: 0, message: "", amount: 0, sender: '', receiver: '', finalised: false, deepLink: '', date: new Date()};
  public isCanceled: boolean = false;
  constructor(private route: ActivatedRoute,
              private _modalCtrl: ModalController,
              private _clientRequest: ClientRequestService,
              private _router: Router,
              private _cookieService: CookiesService,
              private _route: ActivatedRoute) { }
  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      if (params['errorCode'] || params['errorMessage']) {
        this.isCanceled = true;
      } else {
      }
    });

    AppStaticGlobals.txNanoId = this._cookieService.getTxNanoIdCookie();
    this.getTransaction();

    const updateTransaction: TransactionModel =
      {
        id:  this.nano,
        contract: 0,
        message: 'Filler',
        amount: 0,
        sender: AppStaticGlobals.pub_key,
        receiver: 'Filler',
        finalised: true,
        deepLink: 'Filler',
        date: new Date()
      }
      this._clientRequest.transferDeepLinkUrl(updateTransaction);
  }

  getTransaction() {
    this._clientRequest.getTransactionData(AppStaticGlobals.txNanoId).subscribe(
      (data: TransactionModel) => {
        this.transaction = data;
        this.contract = data.contract;
        this.amount = data.amount.toString();
        this.nano = data.id;
        this.nameContranct = this.getContractName(this.contract as Contract);
        this.key = this.grabKey(data.deepLink);


      },
      (error) => {
        console.error('Error fetching transaction data:', error);
      }
    );
  }

  grabKey(deepLink: string): string
  {

    const parts = deepLink.split('pub/');

    const afterPub = parts[1];

    const subParts = afterPub.split('/');

    return subParts.slice(0, subParts.indexOf('con')).join('/');
  }

  public home(){
    this._router.navigate(['/places/payments'])
  }
  private getContractName(con: Contract): string {
    switch (con) {
      case Contract.SOL:
        return 'SOL';
      case Contract.USDC:
        return 'USDC';
      case Contract.USDT:
        return 'USDT';
      case Contract.EURC:
        return 'EURC';
      case Contract.MYRO:
        return 'MYRO';
      case Contract.PSOL:
        return 'PSOL';
      case Contract.JUP:
        return 'JUP';
      case Contract.RNDR:
        return 'RNDR';
      case Contract.PYTH:
        return 'PYTH';
      case Contract.RAY:
        return 'RAY';
      case Contract.ORCA:
        return 'ORCA';
      case Contract.WIF:
        return 'WIF';
      case Contract.ROLLBIT:
        return 'ROLLBIT';
      case Contract.JITOSTAKEDSOL:
        return 'Jito Staked Sol';
      case Contract.WBTC:
        return 'wBTC';
      case Contract.SLERF:
        return 'SLERF';
      case Contract.BONK:
        return 'BONK';
      case Contract.MARINADESTAKEDSOL:
        return 'mSOL';
      case Contract.WETH:
        return 'wEth';
      default:
        return 'Unknown';
    }
  }
}

