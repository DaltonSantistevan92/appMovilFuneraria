export interface IntDurMes {
  status: boolean;
  message: string;
  data: DuracionMes[];
}

export interface DuracionMes {
  id: number;
  duracion: number;
  estado: string;
}