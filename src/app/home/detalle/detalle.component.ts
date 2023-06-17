import { Component, OnInit } from '@angular/core';
import { CartService, DetalleVentaProductoOrServicio } from '../services/cart.service';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent  implements OnInit {
  productos: DetalleVentaProductoOrServicio [] = [];

  iva:number = 0;
  subTotal:number = 0;
  totalGeneralPrice:number = 0;


  constructor(
    private _cartSer : CartService,
    private modalCtrl: ModalController,
    private _gs : GeneralService,
    private router :Router


  ) { }

  ngOnInit() {
    this.getCarritoDetalle();
    this.totalIvaSubTotal();
  }

  getCarritoDetalle(){
    this._cartSer.currentDataCart$.subscribe( listProd => { this.productos = listProd; });
  }

  totalIvaSubTotal(){
    this._cartSer.subtotal$.subscribe(subtotal => {  this.subTotal = subtotal; });
    this._cartSer.iva$.subscribe(iva => {  this.iva = iva; });
    this._cartSer.totalGeneralPrice$.subscribe( totalGeneral => {  this.totalGeneralPrice = totalGeneral; });
  }

  removeProduct(detalle: DetalleVentaProductoOrServicio ) {
    this._cartSer.removeElementCart(detalle);
  }

  aumentar(detalle: DetalleVentaProductoOrServicio){
    this._cartSer.aumentarCantidad(detalle);
  }

  disminuir(detalle: DetalleVentaProductoOrServicio){
    if (detalle.quantity! !== 1) {
      this._cartSer.disminuirCantidad(detalle);
    }
  }

  close(): void {
		this.modalCtrl.dismiss();
	}

  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  verificar(){
    this.modalCtrl.dismiss();    
    this.router.navigate(['home/verificar']);
  }
  

}
