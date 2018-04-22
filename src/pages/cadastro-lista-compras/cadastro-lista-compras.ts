import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Mercado } from '../../models/mercado';
import { MercadoProvider } from '../../providers/mercado/mercado';

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

  public itemsList = [
    {"name":"Mark", "position":"CEO"},
    {"name":"David", "position":"Developer"}
  ];


  constructor(public mercadoProvider:MercadoProvider, public ngZone: NgZone, public loadingController: LoadingController, public produtoProvider: DataServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.produtos = new Array<Produto>();
    this.produtosCache = new Array<Produto>();
    this.mercados = new Array<Mercado>();
  }

  ionViewWillLoad(){
    //this.loadEvent();
    console.log("ionViewWillLoad");
    let loader = this.loadingController.create({
      content: "Pesquisando produtos!"
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
              //this.recuperaProdutos(innerArray);
              this.mercados = innerArray;
              //this.produtosCache = innerArray;
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

  selecionado(produto:Mercado){

  }

}
