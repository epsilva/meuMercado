import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController, ActionSheetButton, ActionSheetController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { Usuario } from '../../models/usuario';
import { LoginPage } from '../login/login';
import { CameraOptions, Camera } from '@ionic-native/camera';
import firebase from 'firebase';
import { Mercado } from '../../models/mercado';

/**
 * Generated class for the ConfiguracaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuracao',
  templateUrl: 'configuracao.html',
})
export class ConfiguracaoPage {

  usuario:Mercado = new Mercado();
  imageSrc: string;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

  constructor(public actionSheetCtrl: ActionSheetController, public loadingController: LoadingController, public camera:Camera, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loginProvider: LoginProvider, public app:App) {
    this.usuario = loginProvider.currentUser;
    this.myPhotosRef = firebase.storage().ref('/Fotos/Usuarios');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Escolha ou tire uma Foto',
      buttons: [
        {
          text: 'Tire uma Foto',
          handler: () => {
            this.tirarFoto();
          }
        },
        {
          text: 'Escolha uma Foto',
          handler: () => {
            this.adicionarImgProduto();
          }
        }
      ]
    });
    actionSheet.present();
  }

  adicionarImgProduto(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 1,
      encodingType: this.camera.EncodingType.JPEG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.upload();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  private upload(): void {
    let loader = this.loadingController.create({
      cssClass: 'transparent'
    });  
    loader.present().then(() => {
      const filename = Math.floor(Date.now() / 1000);
      this.myPhotosRef.child(this.generateUUID()).child(filename+'.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.usuario.foto = savedPicture.downloadURL;
        let usuarioComum:Usuario = this.usuario;
        firebase.database().ref('/usuario/' + this.loginProvider.currentUser.id+'/').update(usuarioComum).then(sucess => {
          if(this.usuario.isMercado){
              firebase.database().ref('/mercado/' + this.loginProvider.currentUser.id+'/').update(this.usuario);  
          }
          loader.dismiss();
        }).catch(error => {
          loader.dismiss();
          this.alerta('Falha', 'Erro vincular imagem ao usuário!');
          console.log(error);
        });
      })
    });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    return this.loginProvider.currentUser.id;
  }

  sair(){
    let loader = this.loadingController.create({
      cssClass: 'transparent'
    }); 
    loader.present().then(() => {
      this.loginProvider.exit().then(sucess => {
        loader.dismiss().then(() => {
          const root = this.app.getRootNav();
          root.popToRoot();
        });
      });
    });
  }

  tirarFoto(){
      // let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
      const options: CameraOptions = {
        quality: 1,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.ALLMEDIA
      }

      this.camera.getPicture(options).then((imageData) => {
        this.myPhoto = imageData;
        this.upload();
      })
      .catch((erro) => {
        this.alerta('Falha', 'Erro ao capturar imagem!');
        console.log(erro);
      })
  }

  /*upload() { 
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child('images/users/'+filename+'.jpg');

    let loader = this.loadingController.create({
      cssClass: 'transparent'
    }); 
    loader.present().then(() => {
      imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
        loader.dismiss();
        this.usuario.foto = snapshot.downloadURL;
        let usuarioComum:Usuario = this.usuario;
        let loaderVincularImgUser = this.loadingController.create({
          content: "Vinculando imagem ao usuário!"
        }); 
        loaderVincularImgUser.present().then(() => {
          firebase.database().ref('/usuario/' + this.loginProvider.currentUser.id+'/').update(usuarioComum).then(sucess => {
            loaderVincularImgUser.dismiss().then(() => {
              if(this.usuario.isMercado){
                let loaderVincularImgUserMercado = this.loadingController.create({
                  content: "Vinculando imagem ao usuário!"
                }); 
                loaderVincularImgUserMercado.present().then(() => {
                  firebase.database().ref('/mercado/' + this.loginProvider.currentUser.id+'/').update(this.usuario).then(sucess => {
                    loaderVincularImgUserMercado.dismiss();
                  }).catch(error => {
                    loaderVincularImgUserMercado.dismiss().then(() => {
                      this.alerta('Falha', 'Erro vincular imagem ao usuário!');
                    });
                  });
                });
              }
            });
          }).catch(error => {
            loaderVincularImgUser.dismiss().then(() => {
              this.alerta('Falha', 'Erro vincular imagem ao usuário!');
              console.log(error);
            });
          }); 
        });
        this.imageSrc = "";
      }).catch(error => {
        loader.dismiss().then(() => {
          this.alerta('Falha', 'Erro fazer o upload da imagem!');
          console.log(error);
        });
      });
    });

  }*/

  private alerta(titulo: string, mensagem: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensagem,
      buttons: ['OK']
    });
    alert.present();
  }

}
