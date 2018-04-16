import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaMercadosPage } from './lista-mercados';

@NgModule({
  declarations: [
    ListaMercadosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaMercadosPage),
  ],
})
export class ListaMercadosPageModule {}
