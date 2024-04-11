import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionModel } from "../interfaces/transaction.model";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientRequestService {
  constructor(private http: HttpClient) { }

  transferDeepLinkUrl(newTransaction: TransactionModel) {

    this.http.post('https://server.paysol.me/api/transaction-handler', newTransaction)
      .subscribe({
        next: () => {
        },
        error: () => {
        }
      });
  }

  getTransactionData(txNanoId: string) : Observable<TransactionModel> {
    return this.http.get<TransactionModel>(`https://server.paysol.me/api/paysoltx/${txNanoId}`);
  }
}
