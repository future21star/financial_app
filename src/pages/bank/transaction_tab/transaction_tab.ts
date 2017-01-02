import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

// import { AboutPage } from '../about/about';
// import { MapPage } from '../map/map';
import { BankDetailPage } from '../bank-detail/bank-detail';
import { GmapBankPage } from '../gmap-bank/gmap-bank';
import { NotificationPage } from '../notification/notification';


@Component({
  templateUrl: 'transaction_tab.html'
})
export class TransactionTabPage {
  // set the root pages for each tab
  tab1Root: any = BankDetailPage;
  tab2Root: any = GmapBankPage;
  fooId: any;
//   tab3Root: any = MapPage;
//   tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.fooId = navParams.data;
  }

}
