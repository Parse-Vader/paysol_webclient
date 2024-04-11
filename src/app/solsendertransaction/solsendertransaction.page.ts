import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PhantomServiceService} from "../services/phantom-service.service";
import {ModalController} from "@ionic/angular";
import {Contract} from "../interfaces/contract.enum";
import {ClientRequestService} from "../services/client-request.service";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {TransactionModel} from "../interfaces/transaction.model";
import {CookiesService} from "../services/cookies.service";

@Component({
  selector: 'app-solsendertransaction',
  templateUrl: './solsendertransaction.page.html',
  styleUrls: ['./solsendertransaction.page.scss'],
})
export class SolsendertransactionPage implements OnInit {

  public amount: string = '';
  public key: string = '';
  public contract: number = 0;
  public nano: string = '';
  public nameContranct: string = '';
  public transaction: TransactionModel = {id: "", contract: 0, message: "", amount: 0, sender: '', receiver: '', finalised: false, deepLink: '', date: new Date()};
  public receiverAddress: string = '';
  constructor(private route: ActivatedRoute,
              private _phantom: PhantomServiceService,
              private _modalCtrl: ModalController,
              private _clientRequestService: ClientRequestService,
              private _cookieService: CookiesService) { }
  ngOnInit()
  {
    // this.route.queryParams.subscribe(params => {
    //   this.key = params['key'];
    //   this.amount = params['amount'];
    //   this.contract = params['contract'];
    //   this.nano = params['nano'];
    //
    // });
    AppStaticGlobals.txNanoId = this._cookieService.getTxNanoIdCookie();
    this.getTransaction();
  }
  makeTransaction()
  {
    this._phantom.signAndSendTransaction(parseFloat(this.amount), this.key, this.contract, this.nano);
  }

  getTransaction() {
    this._clientRequestService.getTransactionData(AppStaticGlobals.txNanoId).subscribe(
      (data: TransactionModel) => {
        this.transaction = data;
        this.contract = data.contract;
        this.amount = data.amount.toString();
        this.nano = data.id;
        this.nameContranct = this.getContractName(this.contract as Contract);
        this.key = this.grabKey(data.deepLink);
        this.receiverAddress = this.key;


      },
      (error) => {
        console.error('Error fetching transaction data:', error);
        // Handle the error here, such as displaying a message to the user
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
