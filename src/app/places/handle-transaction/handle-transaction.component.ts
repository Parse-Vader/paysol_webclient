import { Component, OnInit } from '@angular/core';
import {PhantomServiceService} from "../../services/phantom-service.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-handle-transaction',
  templateUrl: './handle-transaction.component.html',
  styleUrls: ['./handle-transaction.component.scss'],
})
export class HandleTransactionComponent  implements OnInit {
  constructor(private _phantom: PhantomServiceService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.initializeTransaction();
  }

  public async initializeTransaction() : Promise<void> {
    this._route.queryParams.subscribe( async params => {
      const amount: number = params['amount'];
      const pKey: string = params['pubkey'];
      await this._phantom.signAndSendTransaction(amount, pKey);
    });
  }
}
