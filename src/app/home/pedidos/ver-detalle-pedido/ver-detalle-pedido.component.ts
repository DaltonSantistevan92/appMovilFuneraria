import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Detalleventa, Pedido } from '../interfaces/pedidos.interface';
import { GeneralService } from 'src/app/services/general.service';



@Component({
  selector: 'app-ver-detalle-pedido',
  templateUrl: './ver-detalle-pedido.component.html',
  styleUrls: ['./ver-detalle-pedido.component.scss'],
})
export class VerDetallePedidoComponent implements OnInit {

  @Input() pedido!: Pedido;



  constructor(
    private modalController: ModalController,
    private _gs: GeneralService,

  ) {

  }

  ngOnInit() {
    console.log('estamos en ver detalle pedido', this.pedido);

  }

  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  getDetallePedido() {

  }

  close(): void {
		this.modalController.dismiss();
	}
}