import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { LoginProvider } from '../../providers/login/login';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import firebase from 'firebase';
import { Usuario } from '../../models/usuario';
import { Mercado } from '../../models/mercado';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the ListaProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-produtos',
  templateUrl: 'lista-produtos.html',
})
export class ListaProdutosPage {

  produtos: Array<Produto>;
  produtosCache: Array<Produto>;
  usuario:Usuario;

  constructor(public loadingController:LoadingController, public toast: Toast, public ngZone:NgZone, public produtoProvider:DataServiceProvider, public loginProvider:LoginProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.loadEvent();
  }

  loadEvent(){
    this.produtoProvider.initialize();
    this.produtos = new Array<Produto>();
    this.usuario = this.loginProvider.currentUser;
  }

  ionViewWillLoad(){
    this.loadEvent();
    console.log("ionViewWillLoad");
    let loader = this.loadingController.create({
      content: "Pesquisando produtos!"
    }); 
    loader.present().then(() => {
      let mercado:Mercado = new Mercado();
      if(this.navParams.get('mercado') !== undefined){
        mercado = this.navParams.get('mercado');
        console.log(mercado.id);
      }else{
        mercado.id = this.loginProvider.currentUser.id;
      }
      this.produtoProvider.referencia('/produto/'+mercado.id+'/').on('value', (snapshot) => {
        console.log(snapshot.val());
        if(snapshot.val() !== null){
          this.ngZone.run(() => {
            console.log(snapshot.val());
            let innerArray = new Array();
            snapshot.forEach((element) => {
              let el = element.val();
              innerArray.push(el);
            });
            loader.dismiss().then(() => {
              this.produtos = innerArray;
              this.produtosCache = innerArray;
            });            
          });
        }else{
          loader.dismiss().then(() => {
            console.log("Nenhum Registro Encontrado!!");
            this.toastRegistroNaoEncontrado();
          });
        }
      });
    });
  }
  
  toastRegistroNaoEncontrado(){
    this.toast.show('Nenhum Registro Encontrado', '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  pesquisarItens(ev: any) {
    this.produtos = this.produtosCache;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.produtos = this.produtos.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1) ;
      });
    }
  }

}
