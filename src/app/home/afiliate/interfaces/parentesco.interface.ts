export interface IntPar {
  status: boolean;
  message: string;
  data: Parentesco[];
}

export interface Parentesco {
  id: number;
  relacion: string;
  estado: string;
}