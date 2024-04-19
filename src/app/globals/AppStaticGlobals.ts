import { WalletType } from '../auth/auth.page'
export class AppStaticGlobals {
  static Data: string = '';
  static Nonce: string = '';
  static pub_key: string = '';
  static session: string = '';
  static wallet_encryption_public_key: string = '';
  static redirect: boolean = false;
  static txNanoId: string = '';
  static walletType: WalletType = WalletType.PHANTOM;
  static app_url: 'https://phantom.app/' | 'https://solflare.com' = 'https://phantom.app/';

  static setWalletSettings( wallet: WalletType ) {
   AppStaticGlobals.walletType = wallet === WalletType.PHANTOM ? WalletType.PHANTOM : WalletType.SOLFLARE;
   AppStaticGlobals.app_url = wallet === WalletType.PHANTOM ? 'https://phantom.app/' : 'https://solflare.com';
  }
}


