import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {CookiesService} from "../services/cookies.service";



@Component({
  selector: 'app-tx',
  templateUrl: './tx.page.html',
  styleUrls: ['./tx.page.scss'],
})
export class TxPage implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router, private _cookieService: CookiesService) { }

  ngOnInit() {
    const queryParams = this._route.snapshot.queryParams;
    const data = queryParams['data'];
    AppStaticGlobals.txNanoId = data.toString();
    // Do something with the data
    this._cookieService.setTxNanoIdCookie(AppStaticGlobals.txNanoId);

    this._router.navigateByUrl('/auth').catch(error => {});
  }
}
