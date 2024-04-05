import {Router} from "@angular/router";
import {PhantomServiceService} from "../services/phantom-service.service";
import {ClientRequestService} from "../services/client-request.service";
import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  public link: string = '';
  public showSpinner: boolean = true;

  constructor(private _phantomService: PhantomServiceService,
              private _router: Router,
              private _clientRequest: ClientRequestService,
  ) { }

  ngOnInit() {
    this.Connect();
  }
  Connect = () =>
  {
    setTimeout(() => {
      this.showSpinner = false;
      this._phantomService.connect();
    }, 3500);
  }

}
