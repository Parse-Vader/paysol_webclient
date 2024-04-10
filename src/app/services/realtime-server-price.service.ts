import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from "rxjs";
import {TransactionModel} from "../interfaces/transaction.model";

interface PriceResponse {
  [currency: string]: { [key: string]: number };
}
@Injectable({
  providedIn: 'root'
})
export class RealtimeServerPriceService {
  private baseUrl = 'https://price.jup.ag/v4/price';

  constructor(private http: HttpClient) {}
  async getCryptoPrice(cryptoId: string, vsToken: string): Promise<number | null> {
    const params = {ids: cryptoId, vsToken};
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    try {
      const response = await this.http.get<PriceResponse>(this.baseUrl, {headers, params});
      return response[cryptoId]['price'];
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  }

  func(){
    const cryptoId = 'BTC';
    const vsToken = 'ETH';

    this.getCryptoPrice( cryptoId, vsToken)
      .then(price => {
        if (price) {
          console.log(`1 ${cryptoId} costs ${price} ${vsToken}`);
        } else {
          console.error('Failed to retrieve price.');
        }
      });
  }


}
