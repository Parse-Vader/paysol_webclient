import { Injectable } from '@angular/core';
import {BarcodeScanner} from '@capacitor-mlkit/barcode-scanning';
import { isPlatform} from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class BarcodeCheckerService{

  constructor() {
    this.initializeBarcodeModule();
  }

  public async initializeBarcodeModule() {
    if(!isPlatform('ios')){
      const googleModuleChecker = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!googleModuleChecker) {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }
    }
  }
}
