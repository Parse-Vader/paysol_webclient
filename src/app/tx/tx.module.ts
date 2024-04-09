import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TxPageRoutingModule } from './tx-routing.module';

import { TxPage } from './tx.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TxPageRoutingModule
  ],
  declarations: [TxPage]
})
export class TxPageModule {}
