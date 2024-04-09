import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tx',
  templateUrl: './tx.page.html',
  styleUrls: ['./tx.page.scss'],
})
export class TxPage implements OnInit {

  constructor(private _route: ActivatedRoute) { }

  ngOnInit()
  {
    const queryParams = this._route.snapshot.queryParams;
    const data = queryParams['data'];

    // Do something with the data
    console.log('Data:', data);
  }


}
