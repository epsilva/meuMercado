import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ConfiguracaoPage } from '../configuracao/configuracao';
import { CadastroProdutoPage } from '../cadastro-produto/cadastro-produto';
import { ListaProdutosPage } from '../lista-produtos/lista-produtos';
import { ListaMercadosPage } from '../lista-mercados/lista-mercados';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root;
  tab3Root = CadastroProdutoPage;
  tab4Root = ConfiguracaoPage;
  isMercado:boolean;

  constructor(public navParams: NavParams) {

  }

  ionViewWillLoad() {
    console.log("TABS");
    this.isMercado = this.navParams.get('isMercado');
    console.log(this.isMercado);
    if(this.isMercado){
      this.tab2Root = ListaProdutosPage;
    }else{
      this.tab2Root = ListaMercadosPage;
    }
  }
}
