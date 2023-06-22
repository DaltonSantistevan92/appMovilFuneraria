import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService, DetalleVentaProductoOrServicio } from '../services/cart.service';
import { Router } from '@angular/router';
import { VerificarService } from '../services/verificar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { MapService } from '../services/map.service';
import { AlertService } from 'src/app/services/alert.service';
import { GeneralService } from 'src/app/services/general.service';
import { DetalleVenta, Venta, VentaUbicacion } from './interfaces/pedido.interface';
import { PedidoService } from './services/pedido.service';


@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.scss'],
})
export class VerificarComponent implements OnInit, AfterViewInit {
  productos: DetalleVentaProductoOrServicio[] = [];

  ivaNumberText: number = 0;
  iva: number = 0;
  subTotal: number = 0;
  totalGeneralPrice: number = 0;

  formVenta!: FormGroup;
  dataCliente!: User;

  skeleton: boolean = false;
  ubicacion: boolean = false;
  mostrarMapa: boolean = true;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  ubicacionActual!: { provincia: string, canton: string, parroquia: string }


  detalle_venta: any[] = [];

  constructor(
    private _cartSer: CartService,
    private router: Router,
    private _vs: VerificarService,
    private fb: FormBuilder,
    private _as: AuthService,
    private mapService: MapService,
    private _ats: AlertService,
    private _gs: GeneralService,
    private _ps: PedidoService

  ) { }

  ngOnInit() {
    this.initForm();
    this.setCliente();
    this.getCarritoDetalle();
    this.totalGeneral();
    this.pintarNumerIva();
    //console.log('ngOnInit');

    this.mapService.coordenadas$.subscribe(coord => {
      //console.log('nueva coordenada', coord);
      if (coord.lat == 0 && coord.lng == 0) { return }

      this.formVenta.patchValue({ coordenadas: `Lat: ${coord.lat} Lon: ${coord.lng}`, latitud: coord.lat, longitud: coord.lng });
    })

    this.mapService.getUbicacionObservable().subscribe(newUbicacion => {
      //console.log('nueva ubicacion', newUbicacion);
      if (newUbicacion.provincia === '' && newUbicacion.canton === '' && newUbicacion.parroquia === '') { return }

      this.formVenta.patchValue({ provincia: newUbicacion.provincia, canton: newUbicacion.canton, parroquia: newUbicacion.parroquia });
    });


    this.mapService.mapLoaded$.subscribe(verificando => {
      console.log('verificando mapLoaded', verificando);
      if (verificando) {
        this.formVenta.patchValue({ provincia: '', canton: '', parroquia: '', coordenadas: '', latitud: '', longitud: '' });
      }

    })

  }

  ngAfterViewInit() {
    //console.log('ngAfterViewInit');
  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter');

    this.getCarritoDetalle();
    this.totalGeneral();
    this.pintarNumerIva();

    this.mapService.loadGoogleMaps().subscribe({
      next: (res) => {
        // La API de Google Maps se ha cargado exitosamente
        //console.log('loadGoogleMaps', res);
        if (this.mapContainer) {
          const mapElement = this.mapContainer.nativeElement;
          this.mapService.initializeMap(mapElement);

          const form = this.formVenta.value;

          if (form.latitud == '', form.longitud === '') {
            this.ubicacion = true;  //se activa el btn capturar ubicación
            return;
          } else {
            this.ubicacion = false;  //se oculta el btn capturar ubicación

            // Pintar el marcador de tu ubicación
            this.mapService.addMarker(form.latitud, form.longitud, 'Mi ubicación', true);

            // Pintar la ruta desde tu empresa hacia la ubicación del cliente
            this.mapService.drawRoute(this.mapService.empresaLat, this.mapService.empresaLng, form.latitud, form.longitud);
          }

        } else {
          console.error('mapContainer is undefined');
        }
      },
      error: (err) => {
        console.error('Error loading Google Maps:', err);
      }
    });

  }

  initForm() {
    this.formVenta = this.fb.group({
      cliente_id: [''],
      nombreCompletoCliente: [''],
      provincia: ['', [Validators.required]],
      canton: [''],
      parroquia: [''],
      latitud: [''],
      longitud: [''],
      coordenadas: [''],
    });
  }

  async obtenerUbicacion() {
    const posicion = await this.mapService.getCurrentPosition();

    if (posicion) {
      const { latitude, longitude } = posicion.coords;

      this.formVenta.patchValue({ coordenadas: `Lat: ${latitude} Lon: ${longitude}`, latitud: latitude, longitud: longitude });

      const ubicacionAuto = await this.mapService.getProvinciaCantonParroquia(latitude, longitude);

      if (ubicacionAuto) {
        //aqui voy a sacar el precio de envio para cd provincia
        //const prov = this.provincias.find(p => p.provincia === ubicacionAuto.provincia);

        this.formVenta.patchValue({ provincia: ubicacionAuto.provincia, canton: ubicacionAuto.canton, parroquia: ubicacionAuto.parroquia });

        // Pintar el marcador de tu ubicación
        this.mapService.addMarker(latitude, longitude, 'Mi ubicación', true);

        // Pintar la ruta desde tu empresa hacia la ubicación del cliente
        this.mapService.drawRoute(this.mapService.empresaLat, this.mapService.empresaLng, latitude, longitude);
        this.ubicacion = false;  //se oculta el btn capturar ubicación
      } else {
        console.error('Error al obtener la ubicación ');
      }

    }

  }


  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  setCliente() {
    if (this._as.tokenDecodificado != null) {
      this.dataCliente = this._as.tokenDecodificado.user;

      const { persona: { nombres, apellidos, cliente } } = this.dataCliente;
      let cliente_id = null;

      if (cliente && cliente.length > 0) {
        cliente_id = cliente[0].id;
      }

      let nombreCompletoCliente = `${nombres ?? ''} ${apellidos ?? ''}`;

      let data = { nombreCompletoCliente, cliente_id };

      this.formVenta.patchValue(data);
    }
  }

  regresar() {
    this.router.navigate(['/home']);
  }

  pintarNumerIva() {
    this._cartSer.ivaNumber$.subscribe(ivaNumber => this.ivaNumberText = ivaNumber);
  }

  getCarritoDetalle() {
    this._cartSer.currentDataCart$.subscribe(listProd => { this.productos = listProd; });
  }

  totalGeneral() {
    this._cartSer.subtotal$.subscribe(subtotal => { this.subTotal = subtotal; });
    this._cartSer.iva$.subscribe(iva => { this.iva = iva; });
    this._cartSer.totalGeneralPrice$.subscribe(totalGeneral => { this.totalGeneralPrice = totalGeneral; });
  }


  /* //talves ya no utilicemos
  onProvinciaChange() {
    const provinciaId = this.formVenta.get('provincia_id')?.value;
  
    // Filtrar los cantones correspondientes a la provincia seleccionada
    const provincia = this.provincias.find(p => p.id === provinciaId);
  
    this.cantones = provincia ? provincia.canton : [];
  
    // Reiniciar el valor del campo canton_id y parroquia_id
    this.formVenta.patchValue({ canton_id: '', parroquia_id: '' });
  }
  
  ////talves ya no utilicemos
  onCantonChange() {
    const cantonId = this.formVenta.get('canton_id')?.value;
  
    // Filtrar las parroquias correspondientes al cantón seleccionado
    const canton = this.cantones.find(c => c.id === cantonId);
  
    this.parroquias = canton ? canton.parroquia : [];
  
    // Reiniciar el valor del campo parroquia_id
    this.formVenta.patchValue({ parroquia_id: '' });
  }
  */

  savePedido() {
    this.formVenta.markAllAsTouched();
    if (this.formVenta.invalid) { return; }

    if (this.formVenta.valid) {
      const detalle_venta: DetalleVenta[] = this.buildDetalleVenta();
      const json = this.buildJson(detalle_venta);
      console.log(json);
      //creart servicio para enviar la data al backend
      this.guardandoPedido(json);
    }
  }

  guardandoPedido(data: { venta: Venta, venta_ubicacion: VentaUbicacion, detalle_venta: DetalleVenta[] }) {
    this._ps.savePedido(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this._ats.toastAlert(resp.message);
          this.resetPedido();
        } else {
          this._ats.toastAlertDanger(resp.message);
        }
      },
      error: (err) => { console.log(err); },
      complete: () => { this.router.navigate(['/home']) }
    });
  }

  resetPedido() {
    this.ubicacion = true;  //se activa el btn capturar ubicación
    this.formVenta.get('provincia')?.setValue('');
    this.formVenta.get('canton')?.setValue('');
    this.formVenta.get('parroquia')?.setValue('');
    this.formVenta.get('latitud')?.setValue('');
    this.formVenta.get('longitud')?.setValue('');
    this.formVenta.get('coordenadas')?.setValue('');

    this._cartSer.vaciarCartDetalleVenta();
    this._cartSer.vaciarTotalIvaSubtotal();
    localStorage.removeItem('cart_funeraria');
  }

  private buildDetalleVenta(): DetalleVenta[] {
    return this.productos.reduce((result: DetalleVenta[], detalle) => {

      const detalleVenta: DetalleVenta = {
        producto_id: detalle.producto ? detalle.producto.id : null,
        servicio_id: detalle.servicio ? detalle.servicio.id : null,
        cantidad: detalle.quantity!,
        precio: detalle.producto! ? detalle.producto.precio_venta : detalle.servicio?.precio || null,
        total: detalle.quantity! * (detalle.producto ? detalle.producto.precio_venta : detalle.servicio?.precio || 0),
      };
      result.push(detalleVenta);
      return result;
    }, []);
  }

  private buildJson(detalle_venta: DetalleVenta[]): { venta: Venta, venta_ubicacion: VentaUbicacion, detalle_venta: DetalleVenta[] } {
    return { venta: this.buildVenta(), venta_ubicacion: this.buildVentaUbicacion(), detalle_venta: detalle_venta };
  }

  private buildVenta(): Venta {
    return { cliente_id: this.formVenta.value.cliente_id, subtotal: this.subTotal, iva: this.iva, total: this.totalGeneralPrice };
  }

  private buildVentaUbicacion(): VentaUbicacion {
    const form = this.formVenta.value;
    return { provincia: form.provincia, canton: form.canton, parroquia: form.parroquia, latitud: form.latitud, longitud: form.longitud };
  }


}
