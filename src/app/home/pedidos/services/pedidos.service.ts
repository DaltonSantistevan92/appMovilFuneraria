import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntEst, IntResponsePedido, Producto, Servicio } from '../interfaces/pedidos.interface';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  

  api = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  verPedidos(cliente_id: number, estado_id: number, select_fecha_id : number) : Observable<IntResponsePedido>{
    const url = `${this.api}/verPedidos/${cliente_id}/${estado_id}/${select_fecha_id}`;
    return this.http.get<IntResponsePedido>(url);
  }

  getEstados(): Observable<IntEst>{
    const url = `${this.api}/estados`;
    return this.http.get<IntEst>(url);
  }




}
