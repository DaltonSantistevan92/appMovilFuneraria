//
export interface Formulario{
    name?: string;
    email: string; 
    password: string;
}

export interface RespLogin{
    status: boolean;
    message : string;
    token: string;
}

// token decodificado
export interface IntPayload {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
  user: User;
  menu : Menu[];
}

export interface Menu {
  id: number;
  nombre: string;
  icono: string;
  url: string;
  menus_hijos? : any[]
}

export interface User {
  id: number;
  persona_id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at?: string;
  updated_at?: string;
  rol: Rol;
  persona: Persona;
}

export interface Rol {
  id: number;
  cargo: string;
  estado: string;
}

export interface Persona {
  id: number;
  cedula?: any;
  nombres: string;
  apellidos?: any;
  celular?: any;
  direccion?: any;
  estado?: string;
  cliente?: Cliente[];
  //repartidor? : Repartidor[];//por procesar
}

export interface Cliente {
  id: number;
  persona_id: number;
  estado: string;
}

// export interface Repartidor {
//   id: number;
//   persona_id: number;
//   disponible : string;
//   estado: string;
// }
//
export interface IntCc {
    status: boolean;
    message: string;
}

