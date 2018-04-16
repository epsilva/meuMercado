import { Component, Input } from '@angular/core';
import { Produto } from '../../models/produto';

/**
 * Generated class for the ProdutoMercadoListaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'produto-mercado-lista',
  templateUrl: 'produto-mercado-lista.html'
})
export class ProdutoMercadoListaComponent {

  @Input()
  produto:Produto;

}
