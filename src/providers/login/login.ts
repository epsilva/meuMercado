import { Http } from '@angular/http';
import { Injectable, EventEmitter, NgZone } from '@angular/core';
import firebase from 'firebase';
import { Credential } from '../../models/credential';
import { Usuario } from '../../models/usuario';
import { AlertController, LoadingController } from 'ionic-angular';
import { Mercado } from '../../models/mercado';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  currentUser: any;
  isAutenticado: boolean;
  loginSucessoEventEmitter: EventEmitter<any>;
  loginFalhaEventEmitter: EventEmitter<any>;
  logoutEventEmiiter: EventEmitter<any>;

  constructor(public loadingController: LoadingController,  public http: Http, public ngZone: NgZone, public alertCtrl: AlertController) {
    this.loginSucessoEventEmitter = new EventEmitter();
    this.loginFalhaEventEmitter = new EventEmitter();
    this.logoutEventEmiiter = new EventEmitter();
    firebase.auth().onAuthStateChanged(usuario => {
      this.callBackStateChange(usuario);
    });
  }

  private callBackStateChange(usuario) {
    this.ngZone.run(() => {
      if (usuario == null) {
        this.currentUser = null;
        this.isAutenticado = false;
      } else {
        firebase.database().ref('/usuario/' + usuario.uid ).once("value", (snapshot) => {
          if(snapshot.val() !== null){
            this.currentUser = snapshot.val();
            if(this.currentUser.isMercado){
              firebase.database().ref('/mercado/' + usuario.uid ).once("value", (snapshot) => {
                if(snapshot.val() !== null){
                  this.currentUser = snapshot.val();
                }
              });
            }
          }
        });
        this.isAutenticado = true;
      }
    });
  }

  loginWithCredential(credential: Credential, mercado: Mercado, isMercado: boolean) {
    let loader = this.loadingController.create({
      cssClass: 'transparent'
    }); 
    loader.present().then(() => {
      if (!(credential.email == undefined && credential.senha == undefined)) {   
        firebase.auth().signInWithEmailAndPassword(credential.email, credential.senha)
          .then(
          result => {
            loader.dismiss().then(() => {
              this.callBackSucessLogin(result, mercado, isMercado);
            });
          }
          )
          .catch(
          error => {
            loader.dismiss().then(() => {
            this.callBackFailLogin(error);
            });
          }
          );
      } else {
        this.alerta("Dados Obigatórios", "Preencha todos os campos");
      }
    });
  }

  private callBackSucessLogin(response, mercado: Mercado, isMercado: boolean) {
    this.loginSucessoEventEmitter.emit(response.user);
    this.loginSucessoEventEmitter.subscribe(
      user => this.registrarUserInfo(user, mercado, isMercado)
    );
  }

  private registrarUserInfo(user, mercado: Mercado, isMercado: boolean) {
    let usuario: Usuario = new Usuario();
    usuario.nome = user.displayName;
    usuario.email = user.email;
    usuario.id = user.uid;
    firebase.database().ref('usuario/').child(usuario.id).set(usuario).then(sucess => {
      if(isMercado){
        mercado.id = user.id;
        firebase.database().ref('mercado/').child(mercado.id).set(mercado);
      }  
    });
  }

  private callBackFailLogin(erro) {
    this.loginFalhaEventEmitter.emit({ code: erro.code, message: erro.message, email: erro.email, credential: erro.credential });
    this.alertaEmail(erro);
  }

  registrar(credential: Credential, mercado: Mercado, isMercado: boolean) {
    let loader = this.loadingController.create({
      cssClass: 'transparent'
    }); 
    loader.present().then(() => {
      let usuario: Usuario = new Usuario();
      firebase.auth().createUserWithEmailAndPassword(credential.email, credential.senha)
        .then(result => {
          console.log(result);
          usuario.nome = credential.nome;
          usuario.email = credential.email;
          usuario.id = result.uid;
          usuario.isMercado = isMercado;
          firebase.database().ref('usuario/').child(result.uid).set(usuario).then(sucess => {
            loader.dismiss().then(() => {
              if(isMercado){
                mercado.id = result.uid;
                mercado.isMercado = isMercado;
                firebase.database().ref('mercado/').child(result.uid).set(mercado).then(sucess => {
                  this.loginWithCredential(credential, mercado, isMercado);
                }).catch(error => {
                  this.alerta('Falha', 'Erro ao registrar usuario mercado!');
                });
              }else{
                this.loginWithCredential(credential, mercado, isMercado);
              }
            });
          }).catch(error => {
            loader.dismiss().then(() => {
              this.alerta('Falha', 'Erro ao registrar usuario!');
              console.log(error);
            });
          });
        })
        .catch(error => {
          loader.dismiss().then(() => {
            console.log(error);
            this.alertaEmail(error);
          });
        });
    });
  }

  private alertaEmail(erro) {
    if (erro.code == 'auth/invalid-email') {
      this.alerta("Formato do E-mail Inválido", "O e-mail informado não é válido. Exemplo: exemplo@exemplo.com");
    }
    if (erro.code == 'auth/user-not-found') {
      this.alerta("E-mail não cadastrado", "Registre-se antes de inicar no App.");
    }
    if (erro.code == 'auth/wrong-password') {
      this.alerta("Dados incorretos", "E-mail e/ou senha incorretos.");
    }
    if (erro.code == 'auth/weak-password') {
      this.alerta("Senha Fraca", "Senha deve conter no mínimo 6 caracteres.");
    }
    if (erro.code == 'auth/email-already-in-use') {
      this.alerta("E-mail em uso", "Este e-mail já está sendo usado.");
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

  exit() {
    return new Promise((sucess, error) => {
      firebase.auth().signOut().then(
        () => {
          this.logoutEventEmiiter.emit(true);
          sucess('done');
        }
      )
      .catch(
        error => {
          this.logoutEventEmiiter.emit(error);
          error('error');
        }
      );
    });
  }

}
