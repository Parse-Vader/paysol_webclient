import {Component} from '@angular/core';
import { isPlatform} from "@ionic/angular";
import {Barcode, BarcodeScanner, LensFacing} from '@capacitor-mlkit/barcode-scanning';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";


@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})

export class ScanPage {

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });
  public barcodes: Barcode[] = [];

  ionViewDidEnter(){
    if(isPlatform('ios')){
      this.IosInitiliazer();
    }
    this.AndroidInitiliazer();
  }

  public async IosInitiliazer() {
    const supportChecker = await this.isSupported();
    if(supportChecker){
      let permissionChecker = await this.checkPermissions();
      if(permissionChecker === "granted"){
        await this.scan();
      }
      else{
        await this.requestPermissions();
        permissionChecker = await this.checkPermissions();  // <-- Re-check permissions after requesting
        if(permissionChecker === "granted") {
          await this.scan();
        }
      }
    }
  }

  public async AndroidInitiliazer(){
    const supportChecker = await this.isSupported();
    if(supportChecker){
      let permissionChecker = await this.checkPermissions();
      if(permissionChecker === "granted"){
        const googleModuleChecker = await this.isGoogleBarcodeScannerModuleAvailable();
        if (googleModuleChecker){
          await this.scan();
        }
        else{
          await this.installGoogleBarcodeScannerModule();
          return;
        }
      }
      else{
        await this.requestPermissions();
        permissionChecker = await this.checkPermissions();  // <-- Re-check permissions after requesting
        if(permissionChecker === "granted") {
          const googleModuleChecker = await this.isGoogleBarcodeScannerModuleAvailable();
          if (googleModuleChecker) {
            await this.scan();
          } else {
            await this.installGoogleBarcodeScannerModule();
            return;
          }
        }
      }
    }
  }

  public async reScan(): Promise<void> {
    let permissionChecker = await this.checkPermissions();
    if(permissionChecker !== 'granted' || 'limited'){
      this.requestPermissions();
    }
    const formats = this.formGroup.get('formats')?.value || [];
    const { barcodes } = await BarcodeScanner.scan({
      formats,
    });
    this.barcodes = barcodes;
  }

  public async scan(): Promise<void> {
    const formats = this.formGroup.get('formats')?.value || [];
    const { barcodes } = await BarcodeScanner.scan({
      formats,
    });
    this.barcodes = barcodes;
  }

  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  public async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }

  public isGoogleBarcodeScannerModuleAvailable = async () => {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return available;
  };

  public checkPermissions = async () => {
    const { camera } = await BarcodeScanner.checkPermissions();
    return camera;
  };

  public isSupported = async () => {
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  };
}

