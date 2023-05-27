export interface AfiliacionData {
    persona: {
        cedula: string;
        nombres: string;
        apellidos: string;
        celular: string;
        direccion: string;
    };
    cliente: {
        cliente_id: number;
    };
    user: {
        email: string;
    };
    afiliado: {
        cliente_id: number;
        estado_civil_id: number;
    };
    contacto_emergencia: {
        parentesco_id: string;
        nombre: string;
        num_celular: string;
    };
    detalle_afiliado: TableServicios[];
}


export interface TableServicios {
    servicio_id : number; 
    nombre_servicio : string; 
    duracion_mes_id :  number; 
    duracion :  number; 
    costo :  number; 
    precio_servicio : number;
}