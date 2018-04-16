import { Injectable } from '@angular/core';
import { Mercado } from '../../models/mercado';
import firebase from 'firebase';
import { Http } from '@angular/http';

/*
  Generated class for the MercadoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MercadoProvider {

  reference;
  mercado: Mercado;

  constructor(public http: Http) {
    console.log('Hello MercadoProvider Provider');
    this.mercado = new Mercado();
    this.initialize();
  }

  initialize() {
    this.reference = firebase.database().ref("/mercado/");
  }

}
