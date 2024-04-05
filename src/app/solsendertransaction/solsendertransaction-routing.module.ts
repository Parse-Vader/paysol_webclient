import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SolsendertransactionPage} from "./solsendertransaction.page";

const routes: Routes = [
  {
    path: '',
    component: SolsendertransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolsendertransactionPageRoutingModule {}
