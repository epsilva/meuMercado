import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Mercado } from '../../models/mercado';
import { MercadoProvider } from '../../providers/mercado/mercado';
import { LoginProvider } from '../../providers/login/login';
import { ListaProdutosPage } from '../lista-produtos/lista-produtos';
import { Toast } from '@ionic-native/toast';
import { LoadedModule } from 'ionic-angular/util/module-loader';
import { Usuario } from '../../models/usuario';

/**
 * Generated class for the ListaMercadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-mercados',
  templateUrl: 'lista-mercados.html',
})
export class ListaMercadosPage {

  mercados:Array<Mercado>;
  mercadosCache:Array<Mercado>;
  usuario:Usuario;

  constructor(public loadingController: LoadingController, public toast: Toast, public ngZone:NgZone, public mercadoProvider: MercadoProvider, public loginProvider:LoginProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.loadEvent();
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad ListaMercadosPage');
    let loader = this.loadingController.create({
      cssClass: 'transparent'
    }); 
    loader.present().then(() => {
      this.mercadoProvider.reference.on('value', (snapshot) => {
        if(snapshot.val() !== null){
          this.ngZone.run(() => {
            let innerArray = new Array();
              snapshot.forEach((element) => {
              let el = element.val();
              innerArray.push(el);
              loader.dismiss().then(() => {
                this.mercados = innerArray;
                this.mercadosCache = innerArray;
              });
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
    this.toast.show('Nenhum Registro Encontrado', '1500', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  visualizarMercado(mercado:Mercado){
    console.log(mercado);
    this.navCtrl.push(ListaProdutosPage, { 'mercado': mercado });
  }

  loadEvent(){
    this.mercadoProvider.initialize();
    this.mercados = new Array<Mercado>();
    this.usuario = this.loginProvider.currentUser;
  }

}
