import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ver-detalle-fecha-pagos',
  templateUrl: './ver-detalle-fecha-pagos.component.html',
  styleUrls: ['./ver-detalle-fecha-pagos.component.scss'],
})
export class VerDetalleFechaPagosComponent  implements OnInit {
  formPagosAfiliacion!: FormGroup;

  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.formPagosAfiliacion = this.fb.group({
      cliente_id : [''],
    });
  }

}
