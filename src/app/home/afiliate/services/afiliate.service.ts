import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { IntEsCi } from '../interfaces/estado-civil.interface';
import { Observable, tap } from 'rxjs';
import { IntPar } from '../interfaces/parentesco.interface';
import { IntSerPlan } from '../interfaces/servicio-plan.interface';
import { IntDurMes } from '../interfaces/duracion-mes.interface';
import { RespLogin } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import decode from 'jwt-decode'
import { AfiliacionData } from '../interfaces/afiliacion.interface';


@Injectable({
  providedIn: 'root'
})
export class AfiliateService {

  api = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private _as: AuthService
  ) { }

  getEstadoCivil(): Observable<IntEsCi> {
    const url = `${this.api}/estado_civil`;
    return this.http.get<IntEsCi>(url);
  }

  getParentesco(): Observable<IntPar> {
    const url = `${this.api}/parentesco`;
    return this.http.get<IntPar>(url);
  }

  getServicioPlan(): Observable<IntSerPlan> {
    const url = `${this.api}/servicioSoloPlan`;
    return this.http.get<IntSerPlan>(url);
  }

  getDuracionMes(): Observable<IntDurMes> {
    const url = `${this.api}/duracion_mes`;
    return this.http.get<IntDurMes>(url);
  }

  verificacionAfiliacion(cliente_id: number): Observable<{afiliado: boolean,message: string, icono: string, color : string}> {
    const url = `${this.api}/verificacionAfiliacion/${cliente_id}`;
    return this.http.get<{afiliado: boolean,message: string, icono: string, color : string}>(url);
  }

  saveAfiliacion(data: AfiliacionData): Observable<RespLogin> {
    const url = `${this.api}/guardarAfiliado`;
    return this.http.post<RespLogin>(url,data).pipe(tap((resp) => {
      if (resp.token) {
        localStorage.setItem('tokenRip', resp.token);
        this._as.decodificar = decode(resp.token);
        this._as.sendObjePayload(this._as.decodificar);
      } else return;
    }));
  }
}
