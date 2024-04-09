import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TxPage } from './tx.page';

const routes: Routes = [
  {
    path: '',
    component: TxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TxPageRoutingModule {}
