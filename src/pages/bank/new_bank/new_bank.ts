import { Component } from '@angular/core';
import { AlertController, App, ItemSliding, List, ModalController, NavController, LoadingController } from 'ionic-angular';

import { NavParams } from 'ionic-angular';
import { DataService } from '../../../services/data_service';
import { UserData } from '../../../providers/user-data';

import { TabsPage } from '../../tabs/tabs';
import { BankPage } from '../bank';
import { MfaQuestionPage } from '../mfa_question/mfa_question';
import { TransactionTabPage } from '../transaction_tab/transaction_tab';

@Component({
  selector: 'page-new-bank',
  templateUrl: 'new_bank.html'
})
export class NewBankPage {
  session: any;
  bank: {bank_data?: string, bank_rating?: string, user_account_number?: string, bank_user_name?: string, bank_user_password?: string, user_id?: string} = {};
  submitted = false;
  banks = [];

  constructor(
    public navParams: NavParams,
    public dataService: DataService,
    public navCtrl: NavController,
    public userData: UserData
) {
    this.session = navParams.data;
    this.dataService.getAvailableFinancialInstitutions().subscribe(
      data => {
        this.banks = data;
        console.log(this.banks);
      },
      err => {

      }
    );
  }

  onAdd(bankForm) {
    // console.log(this.bank);
    this.submitted = true;
    this.userData.getUsername().then(data => {
      console.log("new bank new user", data);
      this.bank.user_id = JSON.parse(data)._id;
      console.log(this.bank);
      this.dataService.new_bank(this.bank)
      .subscribe(
        data => {
          console.log("add bank-------------------------",data);
          if (data.status === 201) {
            // ---------------------- case for mfa question --------------------------
            this.navCtrl.push(MfaQuestionPage, JSON.parse(data["_body"]));
          } else {
            // this.navCtrl.push(BankPage);
            this.navCtrl.setRoot(TransactionTabPage);
          }
        },
        err => {
          console.log("error");
        }
      )
    });  
  }

  onCancel() {
    this.navCtrl.setRoot(TransactionTabPage);
  }
}
