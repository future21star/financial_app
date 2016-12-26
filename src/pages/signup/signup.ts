import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { DataService } from '../../services/data_service'

import { LoginPage } from '../login/login';
import { NewBankPage } from '../bank/new_bank/new_bank'

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {username?: string, password?: string, register_id?: string} = {};
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userData: UserData,
    public dataService: DataService) {}

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      // this.userData.login(this.login.username);
      this.userData.getRegisterID().then(value => {
        console.log("register id", value);
        this.signup.register_id = value;
        this.dataService.register(this.signup)
          .subscribe(
            data => {
                if (data)
                {
                    let user = data["_body"];
                    this.userData.signup(JSON.parse(user)).then(() => {
                      // this.userData.getUsername().then(data => {
                      //   console.log("sign up", data);
                      // });
                      this.navCtrl.push(NewBankPage);
                    });
                }
                else
                {
                    // this.alertService.error("Usernamd and Password don't match.");
                    // this.loading = false;                        
                }
            },
            error => {
          });
      });
    }
  }
}
