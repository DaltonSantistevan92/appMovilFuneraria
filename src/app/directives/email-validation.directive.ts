import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appEmailValidation]',
  providers: [
    { 
      provide: NG_VALIDATORS, 
      useExisting: EmailValidationDirective, 
      multi: true 
    }
  ]
})
export class EmailValidationDirective {

  constructor() { }

  validate(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }

}
