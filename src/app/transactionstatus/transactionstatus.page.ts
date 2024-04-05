import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from "@ionic/angular";
import {Contract} from "../interfaces/contract.enum";
import {TransactionModel} from "../interfaces/transaction.model";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {ClientRequestService} from "../services/client-request.service";
@Component({
  selector: 'app-transactionstatus',
  templateUrl: './transactionstatus.page.html',
  styleUrls: ['./transactionstatus.page.scss'],
})
export class TransactionstatusPage implements OnInit {
  public amount: string = '';
  public key: string = '';
  public contract: string = '';
  public nano: string = '';
  constructor(private route: ActivatedRoute,
              private _modalCtrl: ModalController,
              private _clientRequest: ClientRequestService,
              private _router: Router) { }
  ngOnInit() {
    this._modalCtrl.dismiss(null, 'cancel');
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
      this.amount = params['amount'];
      this.contract = params['contract'];
      this.nano = params['nano'];
    });
    this.contract = this.getContractName(parseFloat(this.amount))

    const updateTransaction: TransactionModel =
      {
        id:  this.nano,
        contract: 0,
        message: "Filler",
        amount: 0,
        sender: AppStaticGlobals.pub_key,
        receiver: "Filler",
        finalised: true,
        deepLink: "Filler",
        date: new Date()
      }
      this._clientRequest.transferDeepLinkUrl(updateTransaction);
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

