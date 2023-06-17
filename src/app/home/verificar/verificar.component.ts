import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService, DetalleVentaProductoOrServicio } from '../services/cart.service';
import { Producto } from '../interfaces/categoria-producto.interface';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { VerificarService } from '../services/verificar.service';
import { Canton, Parroquia, Provincia } from '../interfaces/provincia.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { MapService } from '../services/map.service';
import { AlertService } from 'src/app/services/alert.service';
import { GeneralService } from 'src/app/services/general.service';
import { Geolocation, Position } from '@capacitor/geolocation';
declare var google: any;


@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.scss'],
})
export class VerificarComponent implements OnInit, AfterViewInit {
  productos: DetalleVentaProductoOrServicio[] = [];

  iva: number = 0;
  subTotal: number = 0;
  totalGeneralPrice: number = 0;

  formVenta!: FormGroup;
  dataCliente!: User;

  skeleton: boolean = false;
  ubicacion: boolean = false;
  mostrarMapa: boolean = true;

  empresaLat: number = -2.1596032;
  empresaLng: number = -79.8957842;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  detalle_venta = new FormControl();
  newDetalle: any[] = [];

  ubicacionActual!: { provincia: string, canton: string, parroquia: string }
  provincias : Provincia [] = [];

  constructor(
    private _cartSer: CartService,
    private router: Router,
    private _vs: VerificarService,
    private fb: FormBuilder,
    private _as: AuthService,
    private mapService: MapService,
    private _ats: AlertService,
    private _gs: GeneralService,

  ) { }

  ngOnInit() {
    this.initForm();
    this.setCliente();
    this.getCarritoDetalle();
    this.totalGeneral();
    this.getProvincias();

    this.mapService.getUbicacionObservable().subscribe(ubicacion => {
      // Actualizar tu formulario reactivo con la ubicación actual
      this.formVenta.patchValue({ provincia: ubicacion.provincia, canton: ubicacion.canton, parroquia: ubicacion.parroquia });
    });
  }

  ngAfterViewInit() {

  }

  ionViewWillEnter() {
    this.getCarritoDetalle();
    this.totalGeneral();
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
      //detalle_venta: this.fb.array([], [Validators.required])
      //provincia_id: ['', [Validators.required]],
      //canton_id: ['', [Validators.required]],
      //parroquia_id: ['', [Validators.required]],
    });
  }

  obtenerUbicacion() {
    this.loadMap();
  }


  loadMap(): void {
    const mapElement = this.mapContainer.nativeElement;
    
    this.mapService.getCurrentPosition()
      .then(position => {
        const { latitude, longitude } = position.coords;
  
        this.skeleton = true;
        this.ubicacion = true;
  
        this.formVenta.get('coordenadas')?.setValue(`Lat: ${latitude} Lon: ${longitude}`);
        this.formVenta.patchValue({ latitud: latitude, longitud: longitude });
  
        this.skeleton = false;
  
        this.mapService.loadMap(mapElement, latitude, longitude)
          .then(() => {
            this.mapService.getProvinciaCantonParroquia(latitude, longitude)
              .then(ubicacion => {
                console.log('Ubicación automática de Google Maps:', ubicacion);
                this.formVenta.patchValue({ provincia: ubicacion.provincia, canton: ubicacion.canton, parroquia: ubicacion.parroquia });

                const prov = this.provincias.find(p => p.provincia === ubicacion.provincia);
                //aqui voy a sacar el precio de envio de cd provinicia
                console.log(prov);
                
                // Pintar el marcador de tu empresa (reemplaza las coordenadas con las de tu empresa)
                this.mapService.addMarker(this.empresaLat, this.empresaLng, 'Mi empresa');
  
                // Pintar el marcador de tu ubicación
                this.mapService.addMarker(latitude, longitude, 'Mi ubicación', true);
  
                // Pintar la ruta desde tu empresa hacia la ubicación del cliente
                this.mapService.drawRoute(this.empresaLat, this.empresaLng, latitude, longitude);
              })
              .catch(error => {
                console.error('Error al obtener la ubicación:', error);
              });
          })
          .catch(error => {
            console.error('Error al cargar el mapa:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener la ubicación:', error);
      });
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

  getCarritoDetalle() {
    this._cartSer.currentDataCart$.subscribe(listProd => { console.log('verificar productos', listProd); this.productos = listProd; });
  }

  totalGeneral() {
    this._cartSer.subtotal$.subscribe(subtotal => { this.subTotal = subtotal; });
    this._cartSer.iva$.subscribe(iva => { this.iva = iva; });
    this._cartSer.totalGeneralPrice$.subscribe(totalGeneral => { this.totalGeneralPrice = totalGeneral; });
  }

  getProvincias() {
    this._vs.getProvincias().subscribe((data) => {
      this.provincias = data.data;
    });
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
    if (this.formVenta.invalid) {
      return;
    }

    if (this.formVenta.valid) {
      const form = this.formVenta.value;
      console.log(form);
    }
  }


}
