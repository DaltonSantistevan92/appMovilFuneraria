import { Component, Input, OnInit } from '@angular/core';

import { Categoria, Producto, Servicio } from '../interfaces/categoria-producto.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../detalle/detalle.component';
import { GeneralService } from 'src/app/services/general.service';
import { ReceptorService } from '../services/receptor.service';

@Component({
  selector: 'app-categoria-producto',
  templateUrl: './categoria-producto.component.html',
  styleUrls: ['./categoria-producto.component.scss'],
})
export class CategoriaProductoComponent implements OnInit {
  categoria!: Categoria;
  nombreCategoria: string = '';
  productos: Producto[] = [];
  servicios: any[] = [];
  servicioDescripcion: string[] = [];

  totalQuantity: number = 0;

  constructor(
    private router: Router,
    private _cartSer: CartService,
    private modalCtrl: ModalController,
    private _gs : GeneralService,
    private _r: ReceptorService
  ) { }

  ngOnInit() {
    this.getDatos();
    this.cantidad();
  }

  getDatos(){
    this._r.getData('categoria').subscribe(data => { 
      this.nombreCategoria = data.nombre_categoria;

      if (data.producto!) {
        this.productos = data.producto!;
      } else {
        // Modificar la descripción y almacenarla en un array separado
        this.servicios = data.servicios!.map((plan: any) => ({ ...plan, descripcion: plan.descripcion.split(",") }));
      }
    });
  }

  cantidad() {
    this._cartSer.currentDataCart$.subscribe(x => this.totalQuantity = x.length);
  }

  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  addToCart(product: Producto | Servicio) {//producto o servicio
    const productoModificado: Producto | Servicio = { ...product, quantity: 1 };
    this._cartSer.cargarCart(productoModificado);
  }

  regresar() {
    this.productos = [];
    this.servicios = [];
    this.router.navigate(['/home']);
  }

  async irDetalleCarrito() {
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      cssClass: 'cart-modal',
      backdropDismiss: false
    });
    modal.present();
  }

}
