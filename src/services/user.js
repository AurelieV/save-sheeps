import firebase from 'firebase/app';
import 'firebase/auth/dist/index.cjs';
import { BehaviorSubject } from 'rxjs';
import app from './firebaseApp';

export default class UserService {
  constructor() {
    this.database = app.database();
    this.auth = firebase.auth(app);
    this.user = new BehaviorSubject(this.auth.currentUser);
    if (!this.auth.currentUser) {
      this.auth.signInAnonymously();
    }
    this.auth.onAuthStateChanged(user => {
      this.user.next(user);
    });
  }
}