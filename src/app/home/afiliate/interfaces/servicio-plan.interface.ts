export interface IntSerPlan {
  status: boolean;
  message: string;
  data: ServicioPlan[];
}

export interface ServicioPlan {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  estado: string;
}