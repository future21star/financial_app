import { Component, ViewChild, ElementRef } from '@angular/core';

import { AlertController, App, ItemSliding, List, ModalController, NavController, LoadingController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';
/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { BankDetailPage } from '../bank-detail/bank-detail';
import { NewBankPage } from '../new_bank/new_bank';
import { NotificationPage } from '../../notification/notification'
// import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
// import { BankDetailPage } from '../bank-detail/bank-detail';

import { ConferenceData } from '../../../providers/conference-data';
import { UserData } from '../../../providers/user-data';

import { DataService } from '../../../services/data_service';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'gmap-bank',
  templateUrl: 'gmap-bank.html'
})
export class GmapBankPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('BankList', { read: List }) bankList: List;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownBanks: any = [];
  groups = [];
  confDate: string;
  banks = [];
  username = "";

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public userData: UserData,
    public dataService: DataService,
    public storage: Storage
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Bank');
    this.updateBank();
    this.loadMap();
  }

  loadMap(){ 
    Geolocation.getCurrentPosition().then((position) => {
      console.log("load map", position);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
    }, (err) => {
      console.log(err);
    });
  }

  addMarker(){
 
    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";          

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

  }
  updateBank() {
    this.storage.get('username').then(data => {
 
      if (data) {
        this.username = JSON.parse(data)["username"];
        console.log("username", data);
        let user_id = JSON.parse(data)._id;
        this.dataService.get_banks_for_user(user_id).subscribe( data => {
          this.banks = data;
          console.log(this.banks);
        });
      }
    });
  }

  presentFilter() {
    // let modal = this.modalCtrl.create(BankFilterPage, this.excludeTracks);
    // modal.present();

    // modal.onWillDismiss((data: any[]) => {
    //   if (data) {
    //     this.excludeTracks = data;
    //     this.updateBank();
    //   }
    // });
  }

  addBank() {
    this.navCtrl.push(NewBankPage);
  }
  
  goToBankDetail(bankData) {
    // go to the bank detail page
    // and pass in the bank data
    this.navCtrl.push(BankDetailPage, bankData);
  }

  addFavorite(slidingItem: ItemSliding, bankData) {

    if (this.userData.hasFavorite(bankData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, bankData, 'Favorite already added');
    } else {
      // remember this bank as a user favorite
      this.userData.addFavorite(bankData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, bankData, title) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this bank from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the bank
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this bank from their favorites
            this.userData.removeFavorite(bankData.name);
            this.updateBank();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network, fab) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  changeNotification() {
    // this.navCtrl.push(NotificationPage);
    let modal = this.modalCtrl.create(NotificationPage);
    modal.present();

    // modal.onWillDismiss((data: any[]) => {
    //   if (data) {
    //     this.excludeTracks = data;
    //     this.updateSchedule();
    //   }
    // });
  }
}
