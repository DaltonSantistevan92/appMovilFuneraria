import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Formulario, IntCc, IntPayload, RespLogin } from '../interfaces/auth.interface';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = environment.apiUrl;
  public decodificar!: IntPayload;

  get token(): string {
    return localStorage.getItem('tokenRip') || '';
  }

  get tokenDecodificado(): IntPayload | null {
    if (this.token == '') { return null; }
    return this.decodificar = decode(this.token);
  }

  private objSourcePayload = new BehaviorSubject<IntPayload>({} as IntPayload);
  public readonly $getObjSourcePayload: Observable<IntPayload> = this.objSourcePayload.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  verificarAutenticacion(): Observable<boolean> {
    if (this.jwtHelper.isTokenExpired(this.token) || !this.token) {
      return of(false);
    }
    return of(true);
  }

  login(data: Formulario): Observable<RespLogin> {
    const url = `${this.api}/loginMovil`;
    return this.http.post<RespLogin>(url, data).pipe(tap((resp) => {
      if (resp.token) {
        localStorage.setItem('tokenRip', resp.token);
        this.decodificar = decode(resp.token);
        this.sendObjePayload(this.decodificar);
      } else return;
    }));
  }

  crearCuenta(data : Formulario): Observable<IntCc> {
    const url = `${this.api}/crearCuenta`;
    return this.http.post<IntCc>(url, data);
  }

  sendObjePayload(data: IntPayload) {
    this.objSourcePayload.next(data);
  }


}
