import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PhantomServiceService} from "../services/phantom-service.service";
import {ModalController} from "@ionic/angular";
import {Contract} from "../interfaces/contract.enum";

@Component({
  selector: 'app-solsendertransaction',
  templateUrl: './solsendertransaction.page.html',
  styleUrls: ['./solsendertransaction.page.scss'],
})
export class SolsendertransactionPage implements OnInit {

  public amount: string = '';
  public key: string = '';
  public contract: string = '';
  public nano: string = '';
  public nameContranct: string = '';
  constructor(private route: ActivatedRoute,
              private _phantom: PhantomServiceService,
              private _modalCtrl: ModalController) { }
  ngOnInit()
  {
    console.log('SolsendertransactionPage');
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
      this.amount = params['amount'];
      this.contract = params['contract'];
      this.nano = params['nano'];

    });

    this.nameContranct = this.getContractName(parseInt(this.contract, 10) as Contract);
  }
  makeTransaction()
  {
    this._phantom.signAndSendTransaction(parseFloat(this.amount), this.key, parseInt(this.contract, 10), this.nano);
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
