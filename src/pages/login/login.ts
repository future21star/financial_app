import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DataService } from '../../services/data_service';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
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
        console.log("register id", value);
        this.login.register_id = value;
        this.dataService.login(this.login)
          .subscribe(
            data => {
                let user = JSON.parse(data["_body"]);
                if (user)
                {
                    this.userData.login(user[0]).then(() => {
                      this.navCtrl.push(TabsPage);
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
