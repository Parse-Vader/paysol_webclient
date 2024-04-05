import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { BiometricAuth } = Plugins;
@Component({
  selector: 'app-locked',
  templateUrl: './locked.page.html',
  styleUrls: ['./locked.page.scss'],
})
export class LockedPage implements OnInit {



  constructor() { }

  async ngOnInit() {
  }

}
