import { Component, Input, OnInit } from '@angular/core';

import { Categoria, Producto, Servicio } from '../interfaces/categoria-producto.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../detalle/detalle.component';

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



  // @Input() item! : Producto;

  constructor(
    private router: Router,
    private _cartSer: CartService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getCard();
    this.cantidad();

  }

  getCard() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras && navigation.extras.state) {
      const categoriaData = navigation.extras.state['categoria'];

      this.categoria = categoriaData;
      this.nombreCategoria = categoriaData.nombre_categoria;

      if (categoriaData.servicios != undefined) {
        // Modificar la descripción y almacenarla en un array separado
        const modifiedResponseCategoryServicioPlan = categoriaData.servicios.map((plan: any) => ({ ...plan, descripcion: plan.descripcion.split(",") }));
        const nuevosServicios = modifiedResponseCategoryServicioPlan;
        this.servicios = nuevosServicios;
      }

      if (categoriaData.producto != undefined) {
        const nuevosProductos = categoriaData.producto;
        this.productos = nuevosProductos;
      }

    }

  }

  cantidad() {
    this._cartSer.currentDataCart$.subscribe(x => this.totalQuantity = x.length);
  }


  addToCart(product: Producto) {
    const productoModificado: Producto = { ...product, quantity: 1 };
    this._cartSer.cargarCart(productoModificado);
  }

  addToCartServicio(servi: any) {
    console.log(servi);


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
