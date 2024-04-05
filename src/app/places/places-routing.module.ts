import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlacesPage } from './places.page';
import {PaymentsPage} from "./payments/payments.page";
import {ScanPage} from "./scan/scan.page";
import {AboutUsPage} from "./about-us/about-us.page";
import {WalletPage} from "./wallet/wallet.page";

const routes: Routes = [
  {
    path: '',
    component: PlacesPage,
    children: [
      { path: 'payments', component: PaymentsPage },
      { path: 'scan', component: ScanPage },
      { path: 'wallet', component: WalletPage },
      { path: 'about-us', component: AboutUsPage}
    ]
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'solsendertransaction',
    loadChildren: () => import('../solsendertransaction/solsendertransaction.module').then( m => m.SolsendertransactionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
