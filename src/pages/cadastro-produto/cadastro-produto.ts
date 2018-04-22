import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController, ActionSheetController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Produto } from '../../models/produto';
import firebase from 'firebase';
import { LoginProvider } from '../../providers/login/login';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'page-cadastro-produto',
  templateUrl: 'cadastro-produto.html'
})
export class CadastroProdutoPage {

  isBarCodeReady:boolean = false;
  isReadonly:boolean = false;
  produto:Produto = new Produto();
  produtoForm: FormGroup;
  imageSrc: string;
  img:string;
  usuario:Usuario = new Usuario();
  produtos: Array<Produto>;
  photos : Array<string>;
  isMostrarImg:boolean = false;
  effect : any;
  cssClass : string;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

  constructor(public actionSheetCtrl:ActionSheetController ,public viewCtrl: ViewController, public ngZone:NgZone, public loadingController: LoadingController, public camera:Camera, public zbar: ZBar, public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private toast: Toast, public dataService: DataServiceProvider, public loginProvider: LoginProvider, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
      this.produto = new Produto();
      this.produtoForm = this.formBuilder.group({
        'barCode': ['', Validators.required],
        'marca': ['', Validators.required],
        'nome': ['', Validators.required],
        'desc': ['', Validators.required],
        'preco': ['', Validators.required],
        'isPromocao': ['', !Validators.required]
      });
      this.usuario = this.loginProvider.currentUser;
      this.produtos = new Array<Produto>();
      this.myPhotosRef = firebase.storage().ref('/Fotos/Produtos');
  }

  limparCampos(){
    this.produtoForm.reset();
    this.isBarCodeReady = false;
    this.produto = new Produto();
  }

  presentActionSheet() {
    if(this.produto.plu !== undefined && this.usuario.isMercado){
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
    }else{
      this.alerta("Opss!!", "Nenhum código de barras encontrado!");
    }
  }

  adicionarImgProduto(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
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
        loader.dismiss().then(() => {
          this.produto.foto = savedPicture.downloadURL;
        });
      });
    });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    return this.loginProvider.currentUser.id;
  }

  mostrarImagem(effect:String){
    this.cssClass = "animated " + effect;
    if(effect !== 'fadeOutUp'){
      this.isMostrarImg = !this.isMostrarImg;
    }else{
      setTimeout(() => {
        this.isMostrarImg = !this.isMostrarImg;
      }, 500);
    }
  }

  ionViewDidLeave(){
    this.isMostrarImg = false;
  }

  @ViewChild('myInput') myInput: ElementRef;
  resize() {
      var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
      var scrollHeight = element.scrollHeight;
      element.style.height = scrollHeight + 'px';
      this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }

  /*selectPhoto(): void {
    let options = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 1,
      encodingType: this.camera.EncodingType.PNG,
    };

    this.camera.getPicture(options).then(imageData => {
      this.imageSrc = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }*/

  /*private uploadPhoto(): void {
    let storageRef = firebase.storage().ref('images');
    const filename = Math.floor(Date.now() / 1000);
    storageRef.child('/produto/').child(filename+'.jpeg')
      .putString(this.imageSrc, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        //this.myPhotoURL = savedPicture.downloadURL;
      });
  }*/

  /*openImagePicker(){
    let options = {
      maximumImagesCount: 1,
    }
    this.photos = new Array<string>();
    this.imagePicker.getPictures(options)
    .then((results) => {
      this.reduceImages(results).then(() => {
        console.log('all images cropped!!');
      });
    }, (err) => { console.log(err) });
  }

  reduceImages(selected_pictures: any) : any{
    return selected_pictures.reduce((promise:any, item:any) => {
      return promise.then((result) => {
        return this.cropService.crop(item, {quality: 1}).then((cropped_image) =>  {
          this.imageSrc = cropped_image;
          this.upload();
        });
      });
    }, Promise.resolve());
  }*/

  /*takePicture(){
    let options = {
      quality: 100,
      correctOrientation: true
    };

    this.camera.getPicture(options)
    .then((data) => {
      this.photos = new Array<string>();
      this.cropService
      .crop(data, {quality: 75})
      .then((newImage) => {
        this.photos.push(newImage);
      }, error => console.error("Error cropping image", error));
    }, function(error) {
      console.log(error);
    });
  }*/


  tirarFoto(){
    // let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
    const options: CameraOptions = {
      quality: 1,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.ALLMEDIA
    }
    this.camera.getPicture(options).then((imageData) => {
      this.myPhoto = imageData;
      this.upload();
    })
    .catch((erro) => {
      alert(erro);
    })
  }

  /*upload() {
    let loader = this.loadingController.create({
      content: "Carregando imagem!"
    });  
    loader.present().then(() => {
      let storageRef = firebase.storage().ref();
      const filename = Math.floor(Date.now() / 1000);
      const imageRef = storageRef.child('images/produto/'+filename+'.jpg');
      console.log("Carregando Imagem - "+this.imageSrc);
      imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
        console.log("Carregando Imagem");
        this.produto.foto = snapshot.downloadURL;
        loader.dismiss().then(() => {
          let loaderVincularImgProduto = this.loadingController.create({
            content: "Vinculando imagem ao produto!"
          }); 
          /*loaderVincularImgProduto.present().then(() => {
            firebase.database().ref('/produto/' + this.loginProvider.currentUser.id + '/' + this.produto.plu).update(this.produto).then(
              sucess => {
                loaderVincularImgProduto.dismiss().then(() => {
                  this.alerta("Sucesso", "Imagem carregada com sucesso!");
                });
              }
            ).catch(error => {
              loaderVincularImgProduto.dismiss().then(() => {
                this.alerta("Falha", "Aconteceu um erro ao carregar a imagem!");
                console.log(error);
              });
            });
          });
        });
        this.imageSrc = "";
      }).catch(error => {
        loader.dismiss().then(() => {
          this.alerta("Falha", "Aconteceu um erro ao carregar a imagem!");
          console.log(error);
        });
      });
    }); 

  }*/

  salvarProduto(){
    if(this.produto.plu !== undefined){
      let loader = this.loadingController.create({
        cssClass: 'transparent'
      });  
      loader.present().then(() => {
        //this.mercado = this.loginProvider.currentUser;
        this.dataService.registrar(this.produto).then(
        sucesso => {
          loader.dismiss().then(() => {
            //this.alerta("Sucesso", "Produto "+this.produto.plu + " salvo com sucesso!");
            this.produtoForm.reset();
            this.produto = new Produto();
          });
        }).catch(
        error => {
          loader.dismiss(() => {
            this.alerta("Falha", "Produto "+this.produto.plu + "não cadastrado!");
          });
        });
      });
    }else{
      this.alerta("Info", "Preencha ao menos o Código de Barra!");
    }
    
  }

  scanBarCodeZBar(){
    let options: ZBarOptions = {
      text_title: "Meu Mercado",
      flash: 'off',
      drawSight: true
    };

    this.zbar.scan(options).then(barcodeData => {
        let loader = this.loadingController.create({
          content: "Pesquisando Produto!"
        });  
        loader.present().then(() => {
          this.produtoForm.reset();
          this.isBarCodeReady = true;
          firebase.database().ref('/produto/' + this.loginProvider.currentUser.id + '/' + barcodeData).once("value", (snapshot) => {
          this.isReadonly = true;
          if(snapshot.val() === null){
            if(this.loginProvider.currentUser.isMercado){
              loader.dismiss().then(() => {
                this.alerta("Ops!!", "Produto não Cadastrado!");
                this.produto.plu = barcodeData;
              });
            }else{
              loader.dismiss().then(() => {
                this.recuperarProdutoPorMercado(barcodeData);
              });
            }
          }else{
            loader.dismiss().then(() => {
              this.produto = snapshot.val();
            });
          }
          });
        });
      }).catch(error => {
        this.isBarCodeReady = false;
        console.log("ZBAR-ERRO", ""+error); // Error message
      });
  }

  recuperarProdutoPorMercado(produto:string){
    let loader = this.loadingController.create({
      content: "Pesquisando Produto/Mercado!"
    }); 
    loader.present().then(() => {
      this.dataService.referenceProduto.on('value', (snapshot) => {
        if(snapshot.val() !== null){
          this.ngZone.run(() => {
            console.log(snapshot.val());
            let innerArray = new Array();
            snapshot.forEach((element) => {
              let el:Produto = element.val();
              if(el.plu === produto){
                innerArray.push(el);
              }  
            });
            loader.dismiss().then(() => {
              this.produtos = innerArray;
            });
          });
        }
      });
    });  
  }

  removerProduto(produto){
    const index: number = this.produtos.indexOf(produto);
    if (index !== -1) {
        this.produtos.splice(index, 1);
    } 
  }

  private alerta(titulo: string, mensagem: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensagem,
      buttons: ['OK']
    });
    alert.present();
  }

}
