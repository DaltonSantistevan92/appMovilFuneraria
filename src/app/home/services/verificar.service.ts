import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntProvincias } from '../interfaces/provincia.interface';

@Injectable({
  providedIn: 'root'
})
export class VerificarService {
  url = environment.apiUrl;

  constructor(private http: HttpClient ) { }

  getProvincias() : Observable <IntProvincias> {
    const url = `${this.url}/provincias`;
    return this.http.get<IntProvincias>(url);
  }

}
