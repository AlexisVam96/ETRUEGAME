import {Compra} from '../compras/models/compra';

export class Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email:string;
  movil:string;
  documento:string;
  enabled: boolean =false;
  roles:string[] = [];
  compras: Compra[] = [];
}
