import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DetalleVenta, Venta, VentaUbicacion } from '../interfaces/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  api = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  savePedido(data: { venta : Venta, venta_ubicacion: VentaUbicacion , detalle_venta : DetalleVenta[] }): Observable<any> {
    const url = `${this.api}/saveVenta`;
    return this.http.post<any>(url,data);
  }
}
