import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PhantomServiceService} from "../services/phantom-service.service";
import {ModalController} from "@ionic/angular";

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
  constructor(private route: ActivatedRoute,
              private _phantom: PhantomServiceService,
              private _modalCtrl: ModalController) { }
  ngOnInit()
  {
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
      this.amount = params['amount'];
      this.contract = params['contract'];
      this.nano = params['nano'];

    });
    this._phantom.signAndSendTransaction(parseFloat(this.amount), this.key, parseInt(this.contract, 10), this.nano);
  }
}
