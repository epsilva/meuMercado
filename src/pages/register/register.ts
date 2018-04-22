import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Credential } from '../../models/credential';
import { LoginProvider } from '../../providers/login/login';
import { Mercado } from '../../models/mercado';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  credential: Credential;
  toggle:boolean = false;
  mercado:Mercado;
  registerForm:FormGroup;
  effect : any;
  cssClass : string;
  isMostrarMercado: boolean = false;

  constructor(public formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, public loginProvider: LoginProvider) {
    this.credential = new Credential();
    this.mercado = new Mercado();

    this.registerForm = this.formBuilder.group({
      'nome': ['', Validators.required],
      'email': ['', Validators.required],
      'senha': ['', Validators.required],
      'toogle': ['', !Validators.required],
      'cnpj': ['', !Validators.required],
      'razaoSocial': ['', !Validators.required],
      'nomeMercado': ['', !Validators.required]
    }); 
  }

  registrar(){
    if(this.toggle){
      this.mercado.nome = this.credential.nome;
      this.mercado.email = this.credential.email;
    }
    this.loginProvider.registrar(this.credential, this.mercado, this.toggle);
  }

  isSupermercado(){
    if(this.toggle){
      this.isMostrarMercado = !this.isMostrarMercado;
      this.cssClass = "animated " + "bounceInLeft";
    }else{
      setTimeout(() => {
        this.isMostrarMercado = !this.isMostrarMercado;
      }, 650);
      this.cssClass = "animated " + "bounceOutRight";
    }
  }

  voltarLogin(){
    this.navCtrl.popToRoot();
  }

}
