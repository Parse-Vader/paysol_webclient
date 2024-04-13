import {MintAddressEnum} from "./mint-address.enum";
import {CurrencyPrice} from "../services/realtime-server-price.service";

export enum Contract {
  SOL,
  USDC,
  USDT,
  EURC,
  MYRO,
  PSOL,
  JUP,
  RNDR,
  PYTH,
  RAY,
  ORCA,
  ROLLBIT,
  WIF,
  JITOSTAKEDSOL,
  MARINADESTAKEDSOL,
  SLERF,
  WBTC,
  BONK,
  WETH
}

const contractToCurrencyPriceMap: { [key in Contract]: CurrencyPrice } = {
  [Contract.SOL]: CurrencyPrice.SOL,
  [Contract.USDC]: CurrencyPrice.USDC,
  [Contract.USDT]: CurrencyPrice.USDT,
  [Contract.EURC]: CurrencyPrice.EURC,
  [Contract.MYRO]: CurrencyPrice.MYRO,
  [Contract.PSOL]: CurrencyPrice.SOL,
  [Contract.JUP]: CurrencyPrice.JUP,
  [Contract.RNDR]: CurrencyPrice.RNDR,
  [Contract.PYTH]: CurrencyPrice.PYTH,
  [Contract.RAY]: CurrencyPrice.RAY,
  [Contract.ORCA]: CurrencyPrice.ORCA,
  [Contract.ROLLBIT]: CurrencyPrice.ROLLBIT,
  [Contract.WIF]: CurrencyPrice.WIF,
  [Contract.JITOSTAKEDSOL]: CurrencyPrice.JITOSTAKEDSOL,
  [Contract.MARINADESTAKEDSOL]: CurrencyPrice.MARINADESTAKEDSOL,
  [Contract.SLERF]: CurrencyPrice.SLERF,
  [Contract.WBTC]: CurrencyPrice.BTC,
  [Contract.BONK]: CurrencyPrice.BONK,
  [Contract.WETH]: CurrencyPrice.SOL
};

export function mapContractToCurrencyPrice(contract: Contract): CurrencyPrice {
  return contractToCurrencyPriceMap[contract];
}
export class ContractHelper {

    private static ContractAddress: { [key in Contract]: string } = {
    [Contract.SOL]: "SOL - Native",
    [Contract.USDC]: MintAddressEnum.USDC,
    [Contract.USDT]: MintAddressEnum.USDT,
    [Contract.EURC]: MintAddressEnum.EURC,
    [Contract.MYRO]: MintAddressEnum.MYRO,
    [Contract.PSOL]: MintAddressEnum.PSOL,
    [Contract.JUP]: MintAddressEnum.JUP,
    [Contract.RNDR]: MintAddressEnum.RNDR,
    [Contract.PYTH]: MintAddressEnum.PYTH,
    [Contract.RAY]: MintAddressEnum.RAY,
    [Contract.ORCA]: MintAddressEnum.ORCA,
    [Contract.WIF]: MintAddressEnum.WIF,
    [Contract.ROLLBIT]: MintAddressEnum.ROLLBIT,
    [Contract.JITOSTAKEDSOL]: MintAddressEnum.JITOSTAKEDSOL,
    [Contract.WBTC]: MintAddressEnum.WBTC,
    [Contract.SLERF]: MintAddressEnum.SLERF,
    [Contract.BONK]: MintAddressEnum.BONK,
    [Contract.MARINADESTAKEDSOL]: MintAddressEnum.MARINADESTAKEDSOL,
    [Contract.WETH]: MintAddressEnum.WETH,
  };

  private static ContractDecimals: { [key in Contract]: number } = {
    [Contract.SOL]: 0,
    [Contract.USDC]: 6,
    [Contract.USDT]: 6,
    [Contract.EURC]: 6,
    [Contract.MYRO]: 9,
    [Contract.PSOL]: 0,
    [Contract.JUP]: 6,
    [Contract.RNDR]: 8,
    [Contract.PYTH]: 6,
    [Contract.RAY]: 6,
    [Contract.ORCA]: 6,
    [Contract.WIF]: 6,
    [Contract.ROLLBIT]: 2,
    [Contract.JITOSTAKEDSOL]: 9,
    [Contract.WBTC]: 8,
    [Contract.SLERF]: 9,
    [Contract.BONK]: 5,
    [Contract.MARINADESTAKEDSOL]: 9,
    [Contract.WETH]: 6,
  };
  static getContractAddress(contract: Contract): string {
    return (ContractHelper.ContractAddress)[contract] || "Unknown Contract";
  }
  static getContractDecimals(contract: Contract): number {
    return (ContractHelper.ContractDecimals)[contract] || 0;
  }
}




