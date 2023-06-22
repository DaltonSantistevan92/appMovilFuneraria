

export interface DetalleVenta {
    producto_id: number | null;
    servicio_id: number | null;
    cantidad: number | null;
    precio: number | null;
    total: number | null;
  }
  
  export interface Venta {
    cliente_id: number;
    subtotal: number;
    iva: number;
    total: number;
  }
  
  export interface VentaUbicacion {
    //provincia_id: number;
    provincia: string;
    canton: string;
    parroquia: string;
    latitud: number;
    longitud: number;
  }