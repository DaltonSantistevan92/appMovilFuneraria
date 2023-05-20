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


export interface IntPayload {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
  user: User;
}

export interface User {
  id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  rol: Rol;
}

export interface Rol {
  id: number;
  cargo: string;
  estado: string;
}

export interface IntCc {
    status: boolean;
    message: string;
}

