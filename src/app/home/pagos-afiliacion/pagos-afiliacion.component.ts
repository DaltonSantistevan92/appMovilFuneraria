import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VerDetalleFechaPagosComponent } from './ver-detalle-fecha-pagos/ver-detalle-fecha-pagos.component';

@Component({
  selector: 'app-pagos-afiliacion',
  templateUrl: './pagos-afiliacion.component.html',
  styleUrls: ['./pagos-afiliacion.component.scss'],
})
export class PagosAfiliacionComponent  implements OnInit {

  constructor(
    private router: Router,
    private modalCtrl: ModalController,

  ) { }

  students : any [] = [
    {
        "name": "Will Smith",
        "gender": "Male",
        "country": "USA"
    },
    {
        "name": "Jackline Joy",
        "gender": "Female",
        "country": "Sri Lanak"
    },
    {
        "name": "Alu Arjun",
        "gender": "Male",
        "country": "Microsoft"
    },
  ];

  ngOnInit() {

  }

  async irDetalle() {
    const modal = await this.modalCtrl.create({
      component: VerDetalleFechaPagosComponent,
      cssClass: 'cart-modal',
      backdropDismiss: false
    });
    modal.present();
  }

  regresar() {
    this.router.navigate(['/home']);
  }

}
