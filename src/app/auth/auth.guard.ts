import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route, Router,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private _authService: AuthService, private router: Router) {}
  canLoad(
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._authService.getAuthenticationState().then(isAuthenticated => {
    //   if (isAuthenticated) {
    //     return true;
    //   } else {
    //     return this.router.createUrlTree(['/auth']);
    //   }
    // }).catch(() => {
    //   return this.router.createUrlTree(['/auth']);
      return true;
    });
  }
}

