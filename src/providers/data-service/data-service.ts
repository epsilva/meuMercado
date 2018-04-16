import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Produto } from '../../models/produto';
import firebase from 'firebase';
import { LoginProvider } from '../login/login';
import { Usuario } from '../../models/usuario';

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
    return firebase.database().ref('/usuario/' + this.loginProvider.currentUser.id).once("value", (snapshot) => {
      let refKeyProduto;

      if(produto.id !== undefined){
        refKeyProduto = produto.id;
      }else{
        refKeyProduto = this.referenceProduto.push().key;
        produto.id = refKeyProduto;
      }
      this.referenceProduto.child(refKeyProduto).update(produto);

      this.usuario = snapshot.val();
      this.reference.child(this.usuario.id + '/' + produto.plu).update(produto);
      
      //this.referenceProduto.child(produto.id).update(produto);
       
      
      /*else {
        // insert
        //produto.idMercado = this.loginProvider.currentUser.id;
       // this.reference.ref(this.usuario.id + '/' + produto.plu).set(produto);
        //this.referenceProduto.ref.set(produto);
      }*/
        
      });
  }

  recuperarProduto(produto:Produto){
    firebase.database().ref('/produto/' + this.loginProvider.currentUser.id + '/' + produto.plu).once("value", (snapshot) => {
      return snapshot.val();
    });
  }

}
