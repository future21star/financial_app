import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction_detail.html'
})
export class TransactionDetailPage {
  transaction: any;

  constructor(public navParams: NavParams) {
    this.transaction = navParams.data;
  }
}
