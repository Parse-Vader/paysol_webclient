import {Component} from '@angular/core';
import {BarcodeCheckerService} from './services/google-module.service';
import {ListenerNavigationService} from "./services/listener-navigation.service";
import {AuthService} from "./auth/auth.service";
import {Platform} from "@ionic/angular";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private _listener: ListenerNavigationService,
              private _barcodeCheckerService: BarcodeCheckerService,
              private _authService: AuthService,
              private platform: Platform
  ) {
    this.initializeApp();
    this._listener.initializeListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      document.body.setAttribute('color-theme', 'dark');
    });
  }
}
