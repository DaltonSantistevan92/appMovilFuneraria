export interface IntProvincias {
  status: boolean;
  message: string;
  data: Provincia[];
}

export interface Provincia {
  id: number;
  provincia: string;
  estado: string;
  canton: Canton[];
}

export interface Canton {
  id: number;
  provincia_id: number;
  canton: string;
  estado: string;
  parroquia: (Parroquia | Parroquia)[];
}

export interface Parroquia {
  id: number;
  parroquia: string;
  canton_id: number;
  estado: string;
}