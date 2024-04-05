import {Component} from '@angular/core';
import {BarcodeCheckerService} from './services/google-module.service';
import {ListenerNavigationService} from "./services/listener-navigation.service";
import {AuthService} from "./auth/auth.service";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private _listener: ListenerNavigationService,
              private _barcodeCheckerService: BarcodeCheckerService,
              private _authService: AuthService,
              ) {
    this._barcodeCheckerService.initializeBarcodeModule();
    this._listener.initializeListener();
  }
}
