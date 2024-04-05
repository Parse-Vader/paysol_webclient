import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionstatusPage } from './transactionstatus.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionstatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionstatusPageRoutingModule {}
