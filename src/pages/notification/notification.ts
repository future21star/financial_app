import { Component } from '@angular/core';
import { AlertController, App, ItemSliding, List, ModalController, NavController, LoadingController } from 'ionic-angular';

import { NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { DataService } from '../../services/data_service'; 
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  session: any;
  notification: {greater_than?: number, frequency?: number, user_id?: string} = {};
  submitted = false;

  constructor(
    public navParams: NavParams,
    public app: App,
    public navCtrl: NavController,
    public userData: UserData,
    public dataService: DataService
  ) {
    this.session = navParams.data;
  }

  ionViewDidLoad() {
    this.app.setTitle('Notification Setting');
    this.load_notification_setting();
  }

  load_notification_setting() {
    this.userData.getUsername().then(data => {
      let user_id = JSON.parse(data)._id;
      this.dataService.get_notification_setting(user_id).subscribe( data => {
        if (data.length > 0) {
          this.notification = data[0];
          console.log(this.notification);
          // console.log(data);
        }
      });
    });
  }
  onChange(notificationForm) {
    this.submitted = true;
    this.userData.getUsername().then(data => {
      if (this.notification.user_id){
        this.dataService.change_notification_setting(this.notification)
        .subscribe(
          data => {
            console.log(data);
            this.navCtrl.push(TabsPage);
          },
          err => {
            console.log("error");
          }
        )
      }
      else {
        this.notification.user_id = JSON.parse(data)._id;

        this.dataService.create_notification_setting(this.notification)
        .subscribe(
          data => {
            console.log(data);
            this.navCtrl.push(TabsPage);
          },
          err => {
            console.log("error");
          }
        )
      }
    });  
  }

  onCancel() {
    this.navCtrl.push(TabsPage);
  }
}
