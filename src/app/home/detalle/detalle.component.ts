import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Producto } from '../interfaces/categoria-producto.interface';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent  implements OnInit {

  productos: Producto [] = [];
  totalGeneralPrice:number = 0;


  constructor(
    private _cartSer : CartService,
    private modalCtrl: ModalController,
    private _gs : GeneralService


  ) { }

  ngOnInit() {
    this.getCarritoDetalle();
    this.totalGeneral();
  }

  getCarritoDetalle(){
    this._cartSer.currentDataCart$.subscribe( listProd => { this.productos = listProd; console.log('mis lista detalle', this.productos) });
  }

  totalGeneral(){
    this._cartSer.totalGeneralPrice$.subscribe( totalGeneral => {  this.totalGeneralPrice = totalGeneral; console.log('total general', this.totalGeneralPrice) });
  }

  removeProduct(producto:Producto){
    this._cartSer.removeElementCart(producto);
  }

  aumentar(producto: Producto){
    this._cartSer.aumentarCantidad(producto);
  }

  disminuir(producto: Producto){
    if (producto.quantity! !== 1) {
      this._cartSer.disminuirCantidad(producto);
    }
  }

  close(): void {
		this.modalCtrl.dismiss();
	}

  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }
  

}
