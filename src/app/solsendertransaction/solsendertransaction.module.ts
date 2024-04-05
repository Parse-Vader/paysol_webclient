import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolsendertransactionPageRoutingModule } from './solsendertransaction-routing.module';

import { SolsendertransactionPage } from './solsendertransaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolsendertransactionPageRoutingModule
  ],
  declarations: [SolsendertransactionPage]
})
export class SolsendertransactionPageModule {}
