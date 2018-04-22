import { Mercado } from "./mercado";

export class Produto{
    id:any;
    plu:string;
    marca:string;
    nome:string;
    preco:string;
    desc:string;
    //mercado:Mercado = new Mercado();
    isPromocao:boolean = true;
    foto:string = "assets/imgs/placeholderCamera.png";
}