import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username) {
    return this.setUsername(JSON.stringify(username)).then(() => {
      this.storage.set(this.HAS_LOGGED_IN, true);
      this.events.publish('user:login');
    });
  };

  signup(username) {
    return this.setUsername(JSON.stringify(username)).then(() => {
      this.storage.set(this.HAS_LOGGED_IN, true);
      this.events.publish('user:signup');
    })
  };

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username) {
    return this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username').then((value) => {
      console.log(value);
      return value;
    });
  };

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };

  //register device token
  registerID(device_token) {
    return this.storage.set('device_token', device_token);
  } 

  //get register id
  getRegisterID() {
    return this.storage.get('device_token').then((value) => {
      return value;
    });
  }
}
