import { Usuario } from "./usuario";
import { Produto } from "./produto";

export class Mercado extends Usuario {
    cnpj: string;
    razaoSocial:String;
    nomeMercado:String;
    produtos:Array<Produto> = new Array<Produto>();
}