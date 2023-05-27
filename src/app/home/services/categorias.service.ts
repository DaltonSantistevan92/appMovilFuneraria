import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Categoria, IntCatPro } from '../interfaces/categoria-producto.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  api = environment.apiUrl;

  private categorias = new BehaviorSubject<Categoria[]>([] as Categoria[]);
  public readonly $getObjSourceCategoria: Observable<Categoria[]> = this.categorias.asObservable();

  private categoriasPlan = new BehaviorSubject<Categoria[]>([] as Categoria[]);
  public readonly $getObjSourceCategoriaServicio: Observable<Categoria[]> = this.categoriasPlan.asObservable();


  constructor(
    private http: HttpClient,

  ) { }

  getCategoriaProducto(): Observable<IntCatPro> {
    const url = `${this.api}/categoriasProductos`;
    return this.http.get<IntCatPro>(url).pipe(tap( (resp) => {
      this.sendObjeCategoria(resp.data);
    }));
  }

  getCategoriaServicio() :  Observable<IntCatPro> {
    const url = `${this.api}/categoriasServicios`;
    return this.http.get<IntCatPro>(url).pipe(tap( (resp) => {
      this.sendObjeCategoriaServicio(resp.data);
    }));
  }

  sendObjeCategoria(data: Categoria[]) {
    this.categorias.next(data);
  }

  sendObjeCategoriaServicio(data: Categoria[]) {
    this.categoriasPlan.next(data);
  }


}
