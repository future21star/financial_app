import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DataService } from '../services/data_service'; 
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { BankPage } from '../pages/bank/bank';
import { GmapBankPage } from '../pages/bank/gmap-bank/gmap-bank';
import { BankDetailPage } from '../pages/bank/bank-detail/bank-detail';
import { NewBankPage } from '../pages/bank/new_bank/new_bank';
import { MfaQuestionPage } from '../pages/bank/mfa_question/mfa_question'
import { TabsPage } from '../pages/tabs/tabs';
import { NotificationPage } from '../pages/notification/notification'

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { AuthService } from '../providers/auth-service';

import { SearchPipe } from '../pipes/search.pipe';
@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    SignupPage,
    BankPage,
    GmapBankPage,
    BankDetailPage,
    MfaQuestionPage,
    NewBankPage,
    TabsPage,
    NotificationPage,

    SearchPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    SignupPage,    
    BankPage,
    GmapBankPage,
    BankDetailPage,
    MfaQuestionPage,
    NewBankPage,
    TabsPage,
    NotificationPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ConferenceData, UserData, Storage, DataService, AuthService]
})
export class AppModule {}
