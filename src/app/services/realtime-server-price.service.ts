import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, firstValueFrom} from "rxjs";
import {Contract} from "../interfaces/contract.enum";
export interface CryptoPrice {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
}
export interface ApiResponse {
  data: {
    [key: string]: CryptoPrice;
  };
  timeTaken: number;
}
export interface ModalItem {
  text: string;
  iconUrl: string;
  contract: Contract;
  priceId: CurrencyPrice
  price: number | null | string;
}
@Injectable({
  providedIn: 'root'
})
export class RealtimeServerPriceService {
  private baseUrl = 'https://price.jup.ag/v4/price';
  private modalItems : ModalItem[] = [
    { text: 'Solana', iconUrl: 'assets/icon/solanaLogoMark.svg', contract: Contract.SOL, priceId: CurrencyPrice.SOL, price: null },
    { text: 'USDC', iconUrl: 'assets/icon/usd-coin-usdc-logo.svg', contract: Contract.USDC, priceId: CurrencyPrice.USDC, price: null },
    { text: 'EURC', iconUrl: 'assets/icon/euro.svg', contract: Contract.EURC, priceId: CurrencyPrice.EURC, price: null },
    { text: 'USDT', iconUrl: 'assets/icon/usdt.svg', contract: Contract.USDT, priceId: CurrencyPrice.USDC, price: null },
    { text: 'MYRO', iconUrl: 'assets/icon/myro.svg', contract: Contract.MYRO, priceId: CurrencyPrice.MYRO, price: null },
    { text: 'JUP', iconUrl: 'assets/icon/jup.svg', contract: Contract.JUP, priceId: CurrencyPrice.JUP, price: null },
    { text: 'RNDR', iconUrl: 'assets/icon/rndr.svg', contract: Contract.RNDR, priceId: CurrencyPrice.RNDR, price: null },
    { text: 'PYTH', iconUrl: 'assets/icon/pyth.svg', contract: Contract.PYTH, priceId: CurrencyPrice.PYTH, price: null },
    { text: 'RAY', iconUrl: 'assets/icon/ray.svg', contract: Contract.RAY, priceId: CurrencyPrice.RAY, price: null },
    { text: 'ORCA', iconUrl: 'assets/icon/orca.svg', contract: Contract.ORCA, priceId: CurrencyPrice.ORCA, price: null },
    { text: 'WIF', iconUrl: 'assets/icon/wif.svg', contract: Contract.WIF, priceId: CurrencyPrice.WIF, price: null },
    { text: 'ROLLBIT', iconUrl: 'assets/icon/rollbit.svg', contract: Contract.ROLLBIT, priceId: CurrencyPrice.ROLLBIT, price: null },
    { text: 'JITOSTAKEDSOL', iconUrl: 'assets/icon/jito.svg', contract: Contract.JITOSTAKEDSOL, priceId: CurrencyPrice.JITOSTAKEDSOL, price: null },
    { text: 'WBTC', iconUrl: 'assets/icon/wbtc.svg', contract: Contract.WBTC, priceId: CurrencyPrice.BTC, price: null },
    { text: 'SLERF', iconUrl: 'assets/icon/slerf.svg', contract: Contract.SLERF, priceId: CurrencyPrice.SLERF, price: null },
    { text: 'BONK', iconUrl: 'assets/icon/bonk.svg', contract: Contract.BONK, priceId: CurrencyPrice.BONK, price: null },
    { text: 'MARINADESTAKEDSOL', iconUrl: 'assets/icon/msol.svg', contract: Contract.MARINADESTAKEDSOL, priceId: CurrencyPrice.MARINADESTAKEDSOL, price: null }
  ];
  constructor(private http: HttpClient) { }
  getUpdatedListOfModalItems(){
    this.setPricesInModalItems();
    return this.modalItems;
  }
  changePrices(setter: string){
    switch (setter) {
      case 'USD':
        this.setPricesInModalItems();
        break;
      case 'EUR':
        this.setPricesInModalItems(vsToken.EURC);
        break;
      case 'SOL':
        this.setPricesInModalItems(vsToken.SOL);
        break;
      case 'BTC':
        this.setPricesInModalItems(vsToken.BTC);
        break;
      case 'ETH':
        this.setPricesInModalItems(vsToken.ETH);
        break;
    }
    return this.modalItems;
  }
  getStringValuta(vsToken: string){
    switch (vsToken) {
      case 'USDC':
        return 'USD';
      case 'EURC':
        return 'EUR'
      case 'SOL':
        return 'SOL'
      case 'WBTC':
        return 'BTC';
      case 'ETH':
        return 'ETH';
      default:
        return '';
    }
  }
  async getAllPrices(getPrices: string[] = Object.values(CurrencyPrice), VsToken = 'USDC'): Promise<string[]> {
    try {
      const prices = await this.getCryptoPrices(getPrices, VsToken);
      return  prices.map((price, index) => {
        if (price !== null) {
          if (VsToken === vsToken.EURC || VsToken === vsToken.USDC){
            price = price > 0.001 ? price = this.trimTrailingZeros(price) : price;
            return VsToken === vsToken.EURC ? `€${price}`: `$${price}`;
          }
          return `${price} ${this.getStringValuta(VsToken)}`;
        } else {
          return `Failed to retrieve price for ${getPrices[index]}.`;
        }
      });
    } catch (error) {
      console.error('Error in funcArray:', error);
      throw error;
    }
  }

  trimTrailingZeros(number: number): number {
    const decimalCount = (number.toString().split('.')[1] || '').length;
    const decimals = decimalCount > 2 ? 2 : decimalCount;
    return parseFloat(number.toFixed(decimals));
  }

  async getCryptoPrices(cryptoIds: string[], vsToken: string): Promise<(number | null )[]> {
    const params = new HttpParams().set('ids', cryptoIds.join(',')).set('vsToken', vsToken);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse>(this.baseUrl, { headers, params }).pipe(
          catchError((error) => {
            console.error('Error fetching prices:', error);
            throw error;
          })
        )
      );
      return cryptoIds.map(cryptoId => response.data[cryptoId]?.price ?? undefined );
    } catch (error) {
      console.error('Error in getCryptoPrices:', error);
      throw error;
    }
  }
  async setPricesInModalItems(vsTokenprice: string = 'USDC'): Promise<void> {
    try {
      const prices = await this.getAllPrices(Object.values(CurrencyPrice), vsTokenprice);

      this.modalItems.forEach((item) => {
        const priceIndex = Object.values(CurrencyPrice).indexOf(item.priceId);
        if (priceIndex !== -1) {
          item.price = prices[priceIndex];
        } else {
          item.price = null;
        }
      });
    } catch (error) {
      console.error('Error in setPricesInModalItems:', error);
    }
  }
  async getTokenPrice(cryptoId: string, VsToken: string = 'USDC') : Promise<number> {
    return this.getCryptoPrices([cryptoId], VsToken)
      .then(price => {
        if (price !== null) {
          return price[0]!;
        } else {
          return 0;
        }
      });
  }
}
export enum CurrencyPrice {
  SOL = 'SOL',
  USDC = 'USDC',
  EURC = 'EURC',
  USDT = 'USDT',
  MYRO = '$MYRO',
  JUP = 'JUP',
  RNDR = 'RENDER',
  PYTH = 'PYTH',
  RAY = 'RAY',
  ORCA = 'ORCA',
  WIF = '$WIF',
  ROLLBIT = 'RLB',
  JITOSTAKEDSOL = 'JitoSOL',
  BTC = 'WBTC',
  SLERF = 'SLERF',
  BONK = 'Bonk',
  MARINADESTAKEDSOL = 'mSOL',
}
export enum vsToken{
  USDC = 'USDC',
  EURC = 'EURC',
  ETH = 'ETH',
  BTC = 'WBTC',
  SOL = 'SOL'
}



