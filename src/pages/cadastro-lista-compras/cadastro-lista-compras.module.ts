import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroListaComprasPage } from './cadastro-lista-compras';

@NgModule({
  declarations: [
    CadastroListaComprasPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroListaComprasPage),
  ],
})
export class CadastroListaComprasPageModule {}
