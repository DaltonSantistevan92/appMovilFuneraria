export interface IntEsCi {
  status: boolean;
  message: string;
  data: EstadoCivil[];
}

export interface EstadoCivil {
  id: number;
  status: string;
  estado: string;
}