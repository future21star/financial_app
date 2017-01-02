import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../../providers/conference-data';
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
  transaction_history: any;
  @ViewChild('mapCanvas') mapElement: ElementRef;
  map: any;

  constructor(
    public actionSheetCtrl: ActionSheetController, 
    public navCtrl: NavController, 
    public confData: ConferenceData, 
    public config: Config,
    public dataService: DataService,    
    public navParams: NavParams,
    public platform: Platform) 
  {
    this.bank = navParams.data;
  }

  ionViewDidLoad() {
    this.confData.getSpeakers().subscribe(speakers => {
      this.speakers = speakers;
    });
    this.dataService.getTransactionHistory(this.bank.access_token).subscribe(
      data => {
        this.transaction_history = data;
        console.log("transaction history", data);
    });
  }

  goToSessionDetail(session) {
    // this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speakerName: any) {
    // this.navCtrl.push(SpeakerDetailPage, speakerName);
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
