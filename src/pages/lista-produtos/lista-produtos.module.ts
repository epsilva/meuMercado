import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaProdutosPage } from './lista-produtos';

@NgModule({
  declarations: [
    ListaProdutosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaProdutosPage),
  ],
})
export class ListaProdutosPageModule {}
