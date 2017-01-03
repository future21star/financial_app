import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DataService } from '../../services/data_service';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { BankPage } from '../bank/bank';
import { TransactionTabPage } from '../bank/transaction_tab/transaction_tab';
import { UserData } from '../../providers/user-data';
import 'rxjs/Rx'; 
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html',
  providers: [DataService]
})
export class LoginPage {
  login: {username?: string, password?: string, register_id?: string} = {};
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userData: UserData,
    private dataService: DataService,
    public storage: Storage
  ) { }

  
  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      this.userData.getRegisterID().then(value => {
        // console.log("register id", value);
        console.log("register id", "");
        this.login.register_id = "";
        
        this.dataService.login(this.login)
          .subscribe(
            data => {
                let user = JSON.parse(data["_body"]);
                console.log("logged in user", user);
                if (user)
                {
                    this.userData.login(user).then(() => {
                      this.navCtrl.push(TransactionTabPage);
                    });
                }
                else
                {
                    this.submitted = false;                     
                }
            },
            error => {
          });
      })
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
