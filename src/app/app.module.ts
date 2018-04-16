import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';

import firebase from 'firebase';
import { HttpModule } from '@angular/http';
import { RegisterPage } from '../pages/register/register';
import { LoginProvider } from '../providers/login/login';
import { ConfiguracaoPage } from '../pages/configuracao/configuracao';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../providers/data-service/data-service'
import { CadastroProdutoPage } from '../pages/cadastro-produto/cadastro-produto';

import { BrMaskerModule } from 'brmasker-ionic-3';
import { ZBar } from '@ionic-native/zbar';
import { Camera } from '@ionic-native/camera';
import { ListaProdutosPage } from '../pages/lista-produtos/lista-produtos';
import { ProdutoListaItemComponenteComponent } from '../components/produto-lista-item-componente/produto-lista-item-componente';
import { MercadoProvider } from '../providers/mercado/mercado';
import { MercadoListaItemComponent } from '../components/mercado-lista-item/mercado-lista-item';
import { ListaMercadosPage } from '../pages/lista-mercados/lista-mercados';
import { ProdutoMercadoListaComponent } from '../components/produto-mercado-lista/produto-mercado-lista';
//import { AnimationService, AnimatesDirective } from 'css-animation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const firebaseConfig = {
  apiKey: "AIzaSyB7TS7Mk9TKW6j4b-4AoKMsmu3e5LPtlw0",
  authDomain: "meumercado-4f3e0.firebaseapp.com",
  databaseURL: "https://meumercado-4f3e0.firebaseio.com",
  projectId: "meumercado-4f3e0",
  storageBucket: "meumercado-4f3e0.appspot.com",
  messagingSenderId: "181150913760"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    ConfiguracaoPage,
    CadastroProdutoPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ListaProdutosPage,
    ProdutoListaItemComponenteComponent,
    MercadoListaItemComponent,
    ProdutoMercadoListaComponent,
    ListaMercadosPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    BrMaskerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    ConfiguracaoPage,
    CadastroProdutoPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ListaProdutosPage,
    ListaMercadosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    BarcodeScanner,
    DataServiceProvider,
    Toast,
    Camera,
    ZBar,
    MercadoProvider
  ]
})
export class AppModule {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    var storage = firebase.storage();
  }
}
