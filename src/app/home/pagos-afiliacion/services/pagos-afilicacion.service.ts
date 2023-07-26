import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntResponseAfiliado } from '../interfaces/pagos-afiliados.interface';

@Injectable({
  providedIn: 'root'
})
export class PagosAfilicacionService {

  api = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getAfiliadoId(cliente_id:number): Observable<{ status:boolean; message:string; afiliado_id:number; }> {
    const url = `${this.api}/recuperarAfiliadoIdPorCliente/${cliente_id}`;
    return this.http.get<{ status:boolean; message:string; afiliado_id:number; }>(url);
  }

  consultaAfiliadoOrTodos(afiliadoIdORTodos:number): Observable<IntResponseAfiliado>{
    const url = `${this.api}/obtenerInformacionAfiliadoOrTodos/${afiliadoIdORTodos}`;
    return this.http.get<IntResponseAfiliado>(url);
  }


}
