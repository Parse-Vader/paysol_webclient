import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionModel } from "../interfaces/transaction.model";

@Injectable({
  providedIn: 'root'
})
export class ClientRequestService {
  constructor(private http: HttpClient) { }

  transferDeepLinkUrl(newTransaction: TransactionModel) {

    this.http.post('https://paysol.me/api/transaction-handler', newTransaction)
      .subscribe({
        next: () => {
        },
        error: () => {
        }
      });
  }
}
