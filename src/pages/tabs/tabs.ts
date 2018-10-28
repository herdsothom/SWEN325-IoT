import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { BatteryPage } from '../battery/battery';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = BatteryPage;

  constructor() {

  }
}
