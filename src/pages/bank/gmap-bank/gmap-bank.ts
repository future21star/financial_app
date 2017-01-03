import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../../providers/conference-data';
import { DataService } from '../../../services/data_service';
import { UserData } from '../../../providers/user-data';
import { Platform } from 'ionic-angular';

declare var google;

@Component({
  selector: 'gmap-bank-detail',
  templateUrl: 'gmap-bank.html'
})
export class GmapBankPage {
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
    public userData: UserData,
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
          this.transaction_history = data;
          this.loadBank();
          console.log("transaction history", data);
      });
    });
  }
  

  loadBank() {
    // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    // let mapOptions = {
    //   center: latLng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }
 
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // let mapEle = this.mapElement.nativeElement;
    //   let map = new google.maps.Map(mapEle, {
    //     center: {"lat":43.074395,"lng":-89.381056},
    //     zoom: 16
    //   });
    // for (let transaction of this.transaction_history) {
    //   let pos = {};
    //   if (transaction["meta"]["location"]["coordinates"]) {
    //     let lat = transaction["meta"]["location"]["coordinates"]["lat"];
    //     let lon = transaction["meta"]["location"]["coordinates"]["lon"];
    //     pos = {
    //       "lat": lat,
    //       "lng": lon
    //     };
    //     let marker = new google.maps.Marker({
    //       map: this.map,
    //       animation: google.maps.Animation.DROP,
    //       position: pos
    //     });
      
    //     let content = "<h4>Information!</h4>";          
      
    //     this.addInfoWindow(marker, content);
    //   }

    // }
    this.confData.getMap().subscribe(mapData => {
      let mapEle = this.mapElement.nativeElement;
      console.log("map center pos", mapData.find(d => d.center));
      let center_pos = {"lat": 43.071584, "lng": -89.3801};
      let map = new google.maps.Map(mapEle, {
        // center: mapData.find(d => d.center),
        center: center_pos,
        zoom: 16
      });
      console.log("-----------------------------mapData---------------------------", mapData);
      if (this.transaction_history) {
        this.transaction_history.forEach(markerData => {
          if (markerData["meta"]["location"]["coordinates"]){
            let infoWindow = new google.maps.InfoWindow({
              content: `<h5>${markerData["_account"]}</h5>`
            });
            let lat = markerData["meta"]["location"]["coordinates"]["lat"];
            let lon = markerData["meta"]["location"]["coordinates"]["lon"];
            let pos = {
              "lat": lat,
              "lng": lon
            };
            let marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: markerData["_account"]
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          }
        });        
      }
      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    });
  }

  addInfoWindow(marker, content){
  
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
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
