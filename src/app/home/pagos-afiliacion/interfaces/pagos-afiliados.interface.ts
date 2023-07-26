export interface IntResponseAfiliado {
    status: boolean;
    message: string;
    data: ResponseAfiliado[];
  }
  
  export interface ResponseAfiliado {
    afiliado_id: number;
    cliente: string;
    servicio_id: number;
    servicio: string;
    precio_servicio: number;
    monto_mensual: number;
    duracion_meses: number;
    letras_pagadas: string;
    letras_pendientes: string;
    monto_pendiente: number;
    monto_pagado: number;
    fecha_pagos: Fechapago[];
  }
  
  export interface Fechapago {
    id: number;
    afiliado_id: number;
    servicio_id: number;
    fecha_pago: string;
    isPagado: string;
  }