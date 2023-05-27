import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/categoria-producto.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<Array<Producto>>([]);
  public currentDataCart$ = this.cart.asObservable();

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalGeneralPrice$ = this.totalPriceSubject.asObservable();

  private get getListCart(): Producto[] {
    return this.cart.getValue();
  }

  constructor() {
    // Cargar el carrito almacenado en el localStorage
    this.loadCartFromLocalStorage();
  }

  private saveCartToLocalStorage(getListCart: Producto[]) {
    localStorage.setItem('cart_funeraria', JSON.stringify(getListCart));
  }

  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart_funeraria');

    if (cartData) {
      const cartItems: Producto[] = JSON.parse(cartData); 
      this.cart.next(cartItems);
      this.actualizarTotales(cartItems);
    }
  }

  cargarCart(pro: Producto){
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
  }

  actualizarTotales(productoActual: Producto[]): void {
    this.totalPriceSubject.next(this.calcularTotalGeneral(productoActual));
  }

  calcularTotalGeneral(productoActual: Producto[]): number {
    return productoActual.reduce((total, producto) => total + producto.quantity! * producto.precio_venta, 0);
  }

  aumentarCantidad(pro: Producto) {
    const productoEnCarrito = this.getListCart.find((p) => p.id === pro.id);
  
    if (productoEnCarrito) {
      productoEnCarrito.quantity!++;
    } 

    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }
  
  disminuirCantidad(pro: Producto) {
    const productoEnCarrito = this.getListCart.find((p) => p.id === pro.id);

    if (productoEnCarrito && productoEnCarrito.quantity! > 0) {
      productoEnCarrito.quantity!--;
    }
    this.cart.next(this.getListCart);
    this.actualizarTotales(this.getListCart);
    this.saveCartToLocalStorage(this.getListCart);
  }
}
