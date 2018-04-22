import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CadastroListaComprasPage } from '../cadastro-lista-compras/cadastro-lista-compras';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { Usuario } from '../../models/usuario';
import { LoginProvider } from '../../providers/login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public effect : any;
  public cssClass : string;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public usuario:Usuario;

  constructor(public camera:Camera, public navCtrl: NavController, public loginProvider:LoginProvider) {
    this.myPhotosRef = firebase.storage().ref('/Photos/');
    this.usuario = new Usuario()
  }

  ionViewDidLoad(){
    this.usuario = this.loginProvider.currentUser;
  }

  criarListaDeCompras(){
    this.navCtrl.push(CadastroListaComprasPage);
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  private uploadPhoto(): void {
    this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
      });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  applyClassBySelection(effect : string) : void
   {
      this.cssClass = "animated " + effect;
   }

}
