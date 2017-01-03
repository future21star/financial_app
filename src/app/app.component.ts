import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import {Push} from 'ionic-native';
import { Storage } from '@ionic/storage';

import { StatusBar, Splashscreen } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { NotificationPage } from '../pages/notification/notification'
import { TabsPage } from '../pages/tabs/tabs';
import { BankPage } from '../pages/bank/bank';
import { TransactionTabPage } from '../pages/bank/transaction_tab/transaction_tab';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any}>;

  appPages: PageInterface[] = [
    // { title: 'Speakers', component: TabsPage, index: 1, icon: 'contacts' },
    // { title: 'Map', component: TabsPage, index: 2, icon: 'map' },
    // { title: 'About', component: TabsPage, index: 3, icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Notification', component: NotificationPage, icon: 'help'},
    { title: 'Bank', component: BankPage, icon: 'calendar' },
    { title: 'Transaction', component: TransactionTabPage, icon: 'person'},
    { title: 'Logout', component: LoginPage, icon: 'log-out', logsOut: true }
    // { title: 'Account', component: AccountPage, icon: 'person' },
    // { title: 'Support', component: SupportPage, icon: 'help' },
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', component: SignupPage, icon: 'person-add' }
    // { title: 'Support', component: SupportPage, icon: 'help' },
  ];
  
  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public storage: Storage
  ) {
    this.initializeApp();
    this.rootPage = LoginPage;
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      if (hasLoggedIn) this.rootPage = TransactionTabPage;
      else this.rootPage = LoginPage;
      this.enableMenu(hasLoggedIn === true);
    })
    this.listenToLoginEvents();
  }
  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }
  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      Splashscreen.hide();
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
            
      // var push = Push.init({
      //   android: {
      //     // senderID: "financialapp-153501" //GCM
      //     senderID: "795708479781"
      //   },
      //   ios: {
      //     alert: "true",
      //     badge: true,
      //     sound: 'false'
      //   },
      //   windows: {}
      // });
      // push.on('registration', (data) => {
      //   console.log(data.registrationId);
      //   this.userData.registerID(data.registrationId);
      //   alert(data.registrationId.toString());
      // });
      // push.on('notification', (data) => {
      //   console.log(data);
      //   alert("Hi, Am a push notification");
      // });
      // push.on('error', (e) => {
      //   console.log(e.message);
      // });
      // this.userData.registerID("123456");
    });
  }

  openPage(page) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });

    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }
}
