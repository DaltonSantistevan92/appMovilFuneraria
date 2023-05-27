export interface IntCatPro {
  status: boolean;
  message: string;
  data: Categoria[];
}

export interface Categoria {
  id: number;
  nombre_categoria: string;
  img : string;
  estado: string;
  producto?: Producto[];
  servicios?: Servicio[];

}

export interface Producto {
  id: number;
  categoria_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  stock: number;
  precio_compra?: any;
  precio_venta: number;
  margen_ganacia?: any;
  fecha: string;
  estado: string;
  quantity?:number;

}

export interface Servicio {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  estado: string;
}
