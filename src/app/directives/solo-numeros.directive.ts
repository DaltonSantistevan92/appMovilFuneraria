import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSoloNumeros]'
})
export class SoloNumerosDirective {

  appNumericOnly: RegExp = /^[0-9]*$/;

  constructor(private ngControl: NgControl, private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])onInputChange(value: string) {
    // Remover cualquier carácter no numérico
    const newVal = value.replace(/[^0-9]/g, '');
  
    // Actualizar el valor en el input
    this.ngControl.valueAccessor?.writeValue(newVal);
  }

}
