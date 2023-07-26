import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResponseAfiliado } from '../interfaces/pagos-afiliados.interface';

@Component({
  selector: 'app-ver-detalle-fecha-pagos',
  templateUrl: './ver-detalle-fecha-pagos.component.html',
  styleUrls: ['./ver-detalle-fecha-pagos.component.scss'],
})
export class VerDetalleFechaPagosComponent  implements OnInit {
  
  @Input() afiliadoResponse!: ResponseAfiliado;
  

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private router :Router
  ) { }

  ngOnInit() {
    console.log('llego la data',this.afiliadoResponse);
  }


  close(){
    this.modalCtrl.dismiss();
    this.router.navigate(['/home/pagos-afiliación']);
  }

}
