import { Component } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage {
  selectedTab: string = 'payments';
  constructor(private _auth: AuthService) { }
}
