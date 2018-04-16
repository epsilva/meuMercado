import { NgModule } from '@angular/core';
import { ProdutoListaItemComponenteComponent } from './produto-lista-item-componente/produto-lista-item-componente';
import { MercadoListaItemComponent } from './mercado-lista-item/mercado-lista-item';
import { ProdutoMercadoListaComponent } from './produto-mercado-lista/produto-mercado-lista';
@NgModule({
	declarations: [ProdutoListaItemComponenteComponent,
    MercadoListaItemComponent,
    ProdutoMercadoListaComponent],
	imports: [],
	exports: [ProdutoListaItemComponenteComponent,
    MercadoListaItemComponent,
    ProdutoMercadoListaComponent]
})
export class ComponentsModule {}
