import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  titlecase(name:string): string {
    return  name.split(" ").map((l: string) => l[0].toUpperCase() + l.substring(1)).join(" ");
  }
}
