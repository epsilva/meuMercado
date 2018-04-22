import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credential } from '../../models/credential';
import { RegisterPage } from '../register/register';
import { LoginProvider } from '../../providers/login/login'
import firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
import { Usuario } from '../../models/usuario';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  credential: Credential;

  constructor(public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public loginProvider: LoginProvider, public menuCtrl: MenuController) {
    this.credential = new Credential();
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.required],
      'senha': ['', Validators.required]
    }); 
  }

  registrar(){
    this.navCtrl.push(RegisterPage);
  }

  onViewDidEnter() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeEnable(false);
  }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged((user) => {
      let loader = this.loadingController.create({
        cssClass: 'transparent'
      }); 
      if (!(!user)) {
        loader.present().then(() => {
          firebase.database().ref('/usuario/' + user.uid ).once("value", (snapshot) => {
            if(snapshot.val() !== null){
              loader.dismiss().then(() => {
                this.navCtrl.push(TabsPage, {'isMercado': snapshot.val().isMercado});
              }
            );
            }
          });
        }).catch(() => {
          loader.dismiss();
        });
      }
    });
  }

  logarComEmail(){
    this.loginProvider.loginWithCredential(this.credential, null, null);
  }
  
}
