import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Categoria } from '../interfaces/categoria-producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ReceptorService {

  private dataSubject = new BehaviorSubject<Categoria>({} as Categoria);

  setData(data: Categoria, key : string) {
      localStorage.setItem(key, JSON.stringify(data));
      this.dataSubject.next(data);
  }

  getData(key:string): BehaviorSubject<Categoria> {
    const storedData = localStorage.getItem(key);

    if (storedData) {
      this.dataSubject.next(JSON.parse(storedData));
    }
    return this.dataSubject;
  }

}
