import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appCedula]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CedulaDirective,
      multi: true
    }
  ]
})
export class CedulaDirective {

  constructor() { }

  validate(control: FormControl): {[key: string]: any} | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.length !== 10 || isNaN(Number(value))) {
      return { cedula: true };
    }

    const digitoRegion = Number(value.substring(0, 2));
    if (digitoRegion < 1 || digitoRegion > 24) {
      return { cedula: true };
    }

    const tercerDigito = Number(value.substring(2, 3));
    if (tercerDigito < 0 || tercerDigito > 5) {
      return { cedula: true };
    }

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < coeficientes.length; i++) {
      const producto = Number(value.charAt(i)) * coeficientes[i];
      suma += producto >= 10 ? producto - 9 : producto;
    }
    
    const ultimoDigitoCalculado = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    const ultimoDigito = Number(value.charAt(9));
    return ultimoDigitoCalculado !== ultimoDigito ? { cedula: true } : null;
  }

}
