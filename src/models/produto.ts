import { Mercado } from "./mercado";

export class Produto{
    id:any;
    plu:String;
    marca:String;
    nome:String;
    preco:String;
    desc:String;
    //mercado:Mercado = new Mercado();
    isPromocao:boolean = true;
    foto:string = "assets/imgs/finiTubes.png";
}