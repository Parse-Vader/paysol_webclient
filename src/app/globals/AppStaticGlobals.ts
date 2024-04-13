export class AppStaticGlobals {
  static Data: string = '';
  static Nonce: string = '';
  static pub_key: string = '';
  static session: string = '';
  static phantom_encryption_public_key: string = '';
  static redirect: boolean = false;


  static DisConnect(){
    AppStaticGlobals.Data = '',
    AppStaticGlobals.Nonce = '',
    AppStaticGlobals.pub_key = '',
    AppStaticGlobals.session = '',
    AppStaticGlobals.phantom_encryption_public_key = '',
    AppStaticGlobals.redirect = false
  }
}
