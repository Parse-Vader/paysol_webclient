import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'places',
    pathMatch: 'full'
  },
  {
    path: 'places',
    loadChildren: () => import('./places/places.module').then( m => m.PlacesPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./places/payments/payments.module').then( m => m.PaymentsPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'scan',
    loadChildren: () => import('./places/scan/scan.module').then( m => m.ScanPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'about-us',
    loadChildren: () => import('./places/about-us/about-us.module').then( m => m.AboutUsPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule),
  },
  {
    path: 'locked',
    loadChildren: () => import('./locked/locked.module').then( m => m.LockedPageModule)
  },
  {
    path: 'transactionstatus',
    loadChildren: () => import('./transactionstatus/transactionstatus.module').then( m => m.TransactionstatusPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'wallet',
    loadChildren: () => import('./places/wallet/wallet.module').then( m => m.WalletPageModule),
    // canLoad: [AuthGuard]
  },
  {
    path: 'solsendertransaction',
    loadChildren: () => import('./solsendertransaction/solsendertransaction.module').then( m => m.SolsendertransactionPageModule),
    // canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
