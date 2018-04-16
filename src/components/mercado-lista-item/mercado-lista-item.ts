import { Component, Input } from '@angular/core';
import { Mercado } from '../../models/mercado';

/**
 * Generated class for the MercadoListaItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mercado-lista-item',
  templateUrl: 'mercado-lista-item.html'
})
export class MercadoListaItemComponent {

  @Input()
  mercado:Mercado;

}
