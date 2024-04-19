import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
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
    canLoad: [AuthGuard]
  },
  {
    path: 'solsendertransaction',
    loadChildren: () => import('./solsendertransaction/solsendertransaction.module').then( m => m.SolsendertransactionPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'tx',
    loadChildren: () => import('./tx/tx.module').then( m => m.TxPageModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
