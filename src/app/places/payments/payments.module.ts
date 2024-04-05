import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentsPageRoutingModule } from './payments-routing.module';
import { PaymentsPage } from './payments.page';
import {PayComponent} from "./pay/pay.component";
import {TransactionComponent} from "./pay/transaction/transaction.component";
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule
  ],
  declarations: [PaymentsPage, PayComponent, TransactionComponent]
})
export class PaymentsPageModule {}
