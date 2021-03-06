import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { TransactionDetailPage } from '../transaction_detail/transaction_detail';
import { ConferenceData } from '../../../providers/conference-data';
import { UserData } from '../../../providers/user-data';
import { DataService } from '../../../services/data_service';

import { Platform } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-bank-detail',
  templateUrl: 'bank-detail.html'
})
export class BankDetailPage {
  actionSheet: ActionSheet;
  speakers = [];
  bank: any;
  transaction_group = {};
  dates = [];
  @ViewChild('mapCanvas') mapElement: ElementRef;
  map: any;

  constructor(
    public actionSheetCtrl: ActionSheetController, 
    public navCtrl: NavController, 
    public confData: ConferenceData, 
    public userData: UserData,
    public config: Config,
    public dataService: DataService,    
    public navParams: NavParams,
    public platform: Platform) 
  {
    this.bank = navParams.data;
  }

  ionViewDidLoad() {
    this.userData.getUsername().then(user => {
      this.dataService.getTransactionHistory(this.bank.access_token, JSON.parse(user)["_id"]).subscribe(
        data => {
          this.dates = [];
          this.transaction_group = {};
          for (let transaction of data) {
            let date = transaction["date"];
            if (!this.transaction_group[date]) {
              this.transaction_group[date] = [];
              this.dates.push(date);
            }
            this.transaction_group[date].push(transaction);              
          }
      });
    });
  }

  goToSessionDetail(session) {
    // this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speakerName: any) {
    // this.navCtrl.push(SpeakerDetailPage, speakerName);
  }

  goToTransactionDetail(transaction: any) {
    this.navCtrl.push(TransactionDetailPage, transaction);
  }
  goToSpeakerTwitter(speaker) {
    new InAppBrowser(`https://twitter.com/${speaker.twitter}`, '_blank');
  }

  openSpeakerShare(speaker) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: ($event) => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openContact(speaker) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }
}
