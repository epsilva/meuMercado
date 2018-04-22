import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Mercado } from '../../models/mercado';
import { MercadoProvider } from '../../providers/mercado/mercado';
import { timeout } from 'rxjs/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-cadastro-lista-compras',
  templateUrl: 'cadastro-lista-compras.html',
})
export class CadastroListaComprasPage {

  produtos: Array<Produto>;
  produtosCache: Array<Produto>;
  public mercados: Array<Mercado>;
  lista: Array<any>;
  effect : any;
  cssClass : string;

  public itemsList = [
    {"name":"Mark", "position":"CEO"},
    {"name":"David", "position":"Developer"}
  ];


  constructor(public viewCtrl: ViewController, public mercadoProvider:MercadoProvider, public ngZone: NgZone, public loadingController: LoadingController, public produtoProvider: DataServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.produtos = new Array<Produto>();
    this.produtosCache = new Array<Produto>();
    this.mercados = new Array<Mercado>();
  }

  ionViewWillLoad(){
    //this.loadEvent();
    console.log("ionViewWillLoad");
    let loader = this.loadingController.create({
      cssClass: 'transparent'
    }); 
    loader.present().then(() => {
      this.produtoProvider.referenceProduto.on('value', (snapshot) => {
        console.log(snapshot.val().u);
        if(snapshot.val() !== null){
          this.ngZone.run(() => {
            console.log(snapshot.val());
            let innerArray = new Array();
            snapshot.forEach((element) => {
              let el = element.val();
              innerArray.push(el);
            });
            loader.dismiss().then(() => {
              this.mercados = innerArray;
            });            
          });
        }



        /*if(snapshot.val() !== null){
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
            //this.toastRegistroNaoEncontrado();
          });
        }*/
      });
    });
  }

  recuperaProdutos(objetos:Array<any>){
    //console.log(objetos);
    let innerArray = new Array();
    objetos.forEach(element => {
      let mercado:Mercado = element;
      console.log(mercado);
    });
    this.mercados = innerArray;
  }

  promiseBuscarProdutoPorMercado(mercado:Mercado){
    return new Promise((sucess, error) => {
      this.produtoProvider.referencia('/produto/'+mercado.id).on('value', (snapshot) => {
        if(snapshot.val() !== null){
          this.ngZone.run(() => {
            console.log(snapshot.val());
            let innerArray = new Array();
            snapshot.forEach((element) => {
              let el = element.val();
              innerArray.push(el);
            }); 
            sucess(innerArray);   
          });
        }else{
          
        }
      });
    });
  }

  showDetalhes(mercado:Mercado){
    if (mercado.showDetalhes) {
      mercado.effect = "animated fadeOutUp";
      setTimeout(() => {
        mercado.showDetalhes = false;
      }, 500);
    } else {
      mercado.showDetalhes = true;
      mercado.effect = "animated fadeInDown";
    }
  }

  selecionado(produto:Mercado){

  }

}
