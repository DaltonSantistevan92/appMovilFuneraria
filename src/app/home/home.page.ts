import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CategoriasService } from './services/categorias.service';
import { Categoria, Producto } from './interfaces/categoria-producto.interface';

import SwiperCore, { SwiperOptions, Autoplay, Pagination } from 'swiper';
// install Swiper modules
SwiperCore.use([Autoplay, Pagination]);

import { register } from 'swiper/element/bundle';
import { CartService } from './services/cart.service';
import { MenuController, ModalController } from '@ionic/angular';
import { DetalleComponent } from './detalle/detalle.component';

register();

export interface Product {
  id: number;
  name: string;
  price: number;
  imagen: string;
  qty: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,  AfterContentChecked {

  products :Producto [] = [];//
  cartItemCount!: BehaviorSubject<number>; 

  categorias : Categoria [] = [];//
  serCategoria :  Categoria [] = [];

  categoryConfig!: SwiperOptions;
  totalQuantity:number = 0;

  constructor(
    private router: Router,
    private _cs: CategoriasService,
    private _cartSer : CartService,
    private modalCtrl: ModalController,
    private menuController: MenuController,

  ) {}


  ngOnInit(): void {
    this.menuController.enable(true);
    this.getCategoryProduc();//
    this.getCategoryServic();
    this.cantidad();  
  }

  ionViewDidEnter() {
    this.menuController.enable(true);
  }

  ngAfterContentChecked() {
    this.categoryConfig = {
      slidesPerView: 3.5
    };
  }

  getCategoryProduc(){//
    this._cs.getCategoriaProducto().subscribe({
      next : (resp) => { 
        this.categorias = resp.data;
      },
      error : (err) => { console.log(err); }
    });
  }

  getCategoryServic(){
    this._cs.getCategoriaServicio().subscribe({
      next : (resp) => { this.serCategoria = resp.data; },
      error : (err) => { console.log(err); }
    });
  }

  salir() {
    localStorage.removeItem('tokenRip');
    this.router.navigate(['/bienvenido']);
  }

  cantidad(){
    this._cartSer.currentDataCart$.subscribe( x => this.totalQuantity = x.length);
  }


  async irDetalleCarrito(){
    const modal = await this.modalCtrl.create({
			component: DetalleComponent,
			cssClass: 'cart-modal'
		});
		modal.present();
  }





 

}
