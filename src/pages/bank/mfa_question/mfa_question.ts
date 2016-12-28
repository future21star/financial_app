import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../../providers/conference-data';
import { DataService } from '../../../services/data_service';
import { TabsPage } from '../../tabs/tabs';

@Component({
  selector: 'mfa_question',
  templateUrl: 'mfa_question.html'
})
export class MfaQuestionPage {
  actionSheet: ActionSheet;
  speakers = [];
  bank: any;
  mfa: any;
  transaction_history: any;
  question: string;
  answer: string;
  access_token: string;
  submitted: boolean = false;

  constructor(
    public actionSheetCtrl: ActionSheetController, 
    public navCtrl: NavController, 
    public confData: ConferenceData, 
    public config: Config,
    public dataService: DataService,    
    public navParams: NavParams) 
  {
    this.mfa = navParams.data.mfa;
    this.question = this.mfa.mfa[0].question;
    this.access_token = this.mfa.access_token;
    console.log("-------------------mfa question----------------------", this.question, this.access_token);
  }

  ionViewDidLoad() {

  }

  onSubmit() {
      this.submitted = true;
      this.dataService.sendMFA(this.access_token, this.answer)
      .subscribe(
          data => {
            console.log("second mfa question", data);
            if (data.status === 201) {
                // ---------------------- case for mfa question --------------------------
                this.navCtrl.push(MfaQuestionPage, JSON.parse(data["_body"]));
            } else {
                this.navCtrl.push(TabsPage);
            }
          },
          error => {

      });
  }

  onCancel() {
      this.navCtrl.push(TabsPage);
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
