import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlfaNumerico]'
})
export class AlfaNumericoDirective {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
   
    this.el.nativeElement.value = initialValue.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ0-9 ]/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      this.control.control?.setValue(this.el.nativeElement.value);
    }
  }

}
