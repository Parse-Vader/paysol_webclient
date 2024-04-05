import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPageRoutingModule,
    QRCodeModule
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
