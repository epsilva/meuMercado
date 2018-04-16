import { Component, Input } from '@angular/core';
import { Produto } from '../../models/produto';

/**
 * Generated class for the ProdutoListaItemComponenteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'produto-lista-item-componente',
  templateUrl: 'produto-lista-item-componente.html'
})
export class ProdutoListaItemComponenteComponent {

  @Input()
  produto:Produto;

}
