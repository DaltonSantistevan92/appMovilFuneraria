import { Injectable } from '@angular/core';
import { Producto, Servicio } from '../interfaces/categoria-producto.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { InConfi } from '../interfaces/configuracion.interface';

export interface DetalleVentaProductoOrServicio {
  producto?: Producto;
  servicio?: Servicio;
  quantity? : number;

}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private cart = new BehaviorSubject<Array<Producto>>([]);
  // public currentDataCart$ = this.cart.asObservable();

  url = environment.apiUrl;

  private cart = new BehaviorSubject<Array<DetalleVentaProductoOrServicio>>([]);
  public currentDataCart$ = this.cart.asObservable();

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalGeneralPrice$ = this.totalPriceSubject.asObservable();

  private subtotalSubject = new BehaviorSubject<number>(0);
  subtotal$ = this.subtotalSubject.asObservable();

  private ivaSubject = new BehaviorSubject<number>(0);
  iva$ = this.ivaSubject.asObservable();

  private ivaNumberSubject = new BehaviorSubject<number>(0);
  public ivaNumber$ = this.ivaNumberSubject.asObservable();

  private get getListCart(): DetalleVentaProductoOrServicio[] {
    return this.cart.getValue();
  }

    
  constructor( private http: HttpClient ) {
    // Cargar el carrito almacenado en el localStorage
    this.loadCartFromLocalStorage();
  }

  private saveCartToLocalStorage(getListCart: DetalleVentaProductoOrServicio[]) {
    localStorage.setItem('cart_funeraria', JSON.stringify(getListCart));
  }

  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart_funeraria');

    if (cartData) {
      const cartItems: DetalleVentaProductoOrServicio[] = JSON.parse(cartData); 
      this.cart.next(cartItems);
      this.actualizarTotales(cartItems);
    }
  }

  vaciarCartDetalleVenta(): void {
    this.cart.next([]);
  }

  vaciarTotalIvaSubtotal(): void {
    this.totalPriceSubject.next(0);
    this.subtotalSubject.next(0);
    this.ivaSubject.next(0);
  }

  cargarCart(pro: Producto | Servicio){
    const elementoCarrito: DetalleVentaProductoOrServicio = { quantity: pro.quantity! };

    if (pro.categoria_id === 3) {
      elementoCarrito.servicio = pro as Servicio;  
    } else {
      elementoCarrito.producto = pro as Producto;
    }
    
    const objIndex = this.getListCart.findIndex( (obj) => obj.producto?.id === elementoCarrito.producto?.id && obj.servicio?.id === elementoCarrito.servicio?.id );

    if (objIndex !== -1) {
      this.getListCart[objIndex].quantity! += 1;
    } else {
      this.getListCart.push(elementoCarrito);
    }

    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }

  removeElementCart(pro: DetalleVentaProductoOrServicio) {
    const objIndex = this.getListCart.findIndex((obj) => obj.producto?.id === pro.producto?.id && obj.servicio?.id === pro.servicio?.id);

    if (objIndex !== -1) {
      this.getListCart[objIndex].quantity = 1;
      this.getListCart.splice(objIndex,1);
    }
    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }

  aumentarCantidad(pro: DetalleVentaProductoOrServicio) {
    const productoEnCarrito = this.getListCart.find((p) => p.producto?.id === pro.producto?.id && p.servicio?.id === pro.servicio?.id);
  
    if (productoEnCarrito) {
      productoEnCarrito.quantity!++;
    } 

    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }

  disminuirCantidad(pro: DetalleVentaProductoOrServicio) {
    const productoEnCarrito = this.getListCart.find((p) =>p.producto?.id === pro.producto?.id && p.servicio?.id === pro.servicio?.id);

    if (productoEnCarrito && productoEnCarrito.quantity! > 0) {
      productoEnCarrito.quantity!--;
    }
    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }

  actualizarTotales(productoActual: DetalleVentaProductoOrServicio[]): void {
    const subtotal = Number(this.calcularSubtotal(productoActual).toFixed(2));
    this.mostrarIva().subscribe(() => {
      const ivaPorcentaje = Number((this.ivaNumberSubject.getValue() / 100).toFixed(2));
      const iva = Number(this.calcularIVA(subtotal, ivaPorcentaje).toFixed(2));
      const totalGeneral = Number((subtotal + iva).toFixed(2));
      this.subtotalSubject.next(subtotal);
      this.ivaSubject.next(iva);
      this.totalPriceSubject.next(totalGeneral);
    });
  }
  
  private calcularSubtotal(productoActual: DetalleVentaProductoOrServicio[]): number {
    return productoActual.reduce((subtotal, producto) => {
      const cantidad = producto.quantity || 0;
      const precioVenta = producto.producto?.precio_venta || producto.servicio?.precio || 0;
      return subtotal + cantidad * precioVenta;
    }, 0);
  }

  private mostrarIva() {
    const url = `${this.url}/config`;
    return this.http.get<InConfi[]>(url).pipe(tap(data => {
        const ivaNumber = data[0].iva;
        this.ivaNumberSubject.next(ivaNumber);
      })
    );
  }

  private calcularIVA(subtotal: number, ivaPorcentaje: number): number {
    return subtotal * ivaPorcentaje;
  }


   /* actualizarTotales(productoActual: DetalleVentaProductoOrServicio[]): void {
    const subtotal = this.calcularSubtotal(productoActual);
    const iva = this.calcularIVA(subtotal);
    this.subtotalSubject.next(subtotal);
    this.ivaSubject.next(iva);
    const totalGeneral = subtotal + iva;
    this.totalPriceSubject.next(totalGeneral);
  } */

  /* private calcularIVA(subtotal: number): number {
    const ivaPorcentaje = 0.12; // Asumiendo que el IVA es del 12%
    return subtotal * ivaPorcentaje;
  } */

  /* actualizarTotales(productoActual: DetalleVentaProductoOrServicio[]): void {
    const totalGeneral = this.calcularTotalGeneral(productoActual);
    this.totalPriceSubject.next(totalGeneral);
  }
  
  calcularTotalGeneral(productoActual: DetalleVentaProductoOrServicio[]): number {
    return productoActual.reduce((total, producto) => {
      const cantidad = producto.quantity || 0;
      const precioVenta = producto.producto?.precio_venta || producto.servicio?.precio || 0;
      return total + cantidad * precioVenta;
    }, 0);
  } */

 
  
  
  
    //para 1 producto
  // constructor() {
  //   Cargar el carrito almacenado en el localStorage
  //   this.loadCartFromLocalStorage();
  // }

  // private saveCartToLocalStorage(getListCart: Producto[]) {
  //   localStorage.setItem('cart_funeraria', JSON.stringify(getListCart));
  // }

  // private loadCartFromLocalStorage() {
  //   const cartData = localStorage.getItem('cart_funeraria');

  //   if (cartData) {
  //     const cartItems: Producto[] = JSON.parse(cartData); 
  //     this.cart.next(cartItems);
  //     this.actualizarTotales(cartItems);
  //   }
  // }

  /* cargarCart(pro: Producto){
    const objIndex = this.getListCart.findIndex((obj) => obj.id === pro.id);

    if (objIndex !== -1) {
      this.getListCart[objIndex].quantity! += 1;
    } else {
      this.getListCart.push(pro);
    }
    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }

  removeElementCart(pro:Producto){
    const objIndex = this.getListCart.findIndex((obj => obj.id == pro.id));
    
    if(objIndex != -1){
      this.getListCart[objIndex].quantity = 1;
      this.getListCart.splice(objIndex,1);
    }
    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  } */

 /*  actualizarTotales(productoActual: Producto[]): void {
    this.totalPriceSubject.next(this.calcularTotalGeneral(productoActual));
  }

  calcularTotalGeneral(productoActual: Producto[]): number {
    return productoActual.reduce((total, producto) => total + producto.quantity! * producto.precio_venta, 0);
  } */

  // aumentarCantidad(pro: Producto) {
  //   const productoEnCarrito = this.getListCart.find((p) => p.id === pro.id);
  
  //   if (productoEnCarrito) {
  //     productoEnCarrito.quantity!++;
  //   } 

  //   this.cart.next(this.getListCart);
  //   this.actualizarTotales(this.getListCart);
  //   this.saveCartToLocalStorage(this.getListCart);
  // }
  
  // disminuirCantidad(pro: Producto) {
  //   const productoEnCarrito = this.getListCart.find((p) => p.id === pro.id);

  //   if (productoEnCarrito && productoEnCarrito.quantity! > 0) {
  //     productoEnCarrito.quantity!--;
  //   }
  //   this.cart.next(this.getListCart);
  //   this.actualizarTotales(this.getListCart);
  //   this.saveCartToLocalStorage(this.getListCart);
  // }
}
