import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionstatusPageRoutingModule } from './transactionstatus-routing.module';

import { TransactionstatusPage } from './transactionstatus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionstatusPageRoutingModule
  ],
  declarations: [TransactionstatusPage]
})
export class TransactionstatusPageModule {}
