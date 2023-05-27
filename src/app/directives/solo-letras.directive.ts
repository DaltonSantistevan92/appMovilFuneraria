import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSoloLetras]'
})
export class SoloLetrasDirective {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const value = this.el.nativeElement.value;
  
    const newValue = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ ]/g, '');
    this.control.control?.setValue(newValue, { emitEvent: false });
  }

}
