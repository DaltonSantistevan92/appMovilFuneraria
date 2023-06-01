import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  api = environment.apiUrl;

  constructor() { }

  titlecase(name:string): string {
    return  name.split(" ").map((l: string) => l[0].toUpperCase() + l.substring(1)).join(" ");
  }

  verImagen(folder:string,file:string){
    let url:string = `${this.api}/mostrarImagen/${folder}/${file}`;
    return url;
  }
}
