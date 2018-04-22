import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Produto } from '../../models/produto';
import firebase from 'firebase';
import { LoginProvider } from '../login/login';
import { Usuario } from '../../models/usuario';
import { Mercado } from '../../models/mercado';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  reference;
  referenceProduto;
  private usuario:Usuario = new Usuario();

  constructor(public http: Http, public loginProvider: LoginProvider) {
    console.log('Hello DataServiceProvider Provider');
    this.initialize();
  }

  getProducts(){
    return this.http.get('assets/data/products.json')
      .map((response:Response)=>response.json());
  }

  initialize() {
    this.reference = firebase.database().ref("/produto/");
    this.referenceProduto = firebase.database().ref("/produto-geral/");
  }

  referencia(ref:string) : any{
    return firebase.database().ref(ref);
  }

  registrar(produto: Produto) {
    let mercado:Mercado = this.loginProvider.currentUser;
    mercado.produtos = new Array<Produto>();
    this.reference.child(this.loginProvider.currentUser.id + '/' + produto.plu).update(produto);
    this.referenceProduto = firebase.database().ref("/produto-geral/"+mercado.id+"/");
    return firebase.database().ref('/produto/' + this.loginProvider.currentUser.id).once("value", (snapshot) => {
      snapshot.val().forEach(element => {
        mercado.produtos.push(element);
      });
      this.referenceProduto.update(mercado);
    });
  }

  recuperarProduto(produto:Produto){
    firebase.database().ref('/produto/' + this.loginProvider.currentUser.id + '/' + produto.plu).once("value", (snapshot) => {
      return snapshot.val();
    });
  }

}
