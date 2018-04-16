import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public effect : any;
  public cssClass : string;


  constructor(public navCtrl: NavController) {

  }

  applyClassBySelection(effect : string) : void
   {
      this.cssClass = "animated " + effect;
   }

}
