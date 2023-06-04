import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EstadoCivil } from './interfaces/estado-civil.interface';
import { AfiliateService } from './services/afiliate.service';
import { Parentesco } from './interfaces/parentesco.interface';
import { ServicioPlan } from './interfaces/servicio-plan.interface';
import { DuracionMes } from './interfaces/duracion-mes.interface';
import { AlertService } from 'src/app/services/alert.service';
import { GeneralService } from 'src/app/services/general.service';
import { AfiliacionData, TableServicios } from './interfaces/afiliacion.interface';


@Component({
  selector: 'app-afiliate',
  templateUrl: './afiliate.component.html',
  styleUrls: ['./afiliate.component.scss'],
})
export class AfiliateComponent implements OnInit, AfterContentInit {

  dataCliente!: User;
  formAfilicacion!: FormGroup;

  estadoCivil: EstadoCivil[] = [];
  parentesco: Parentesco[] = [];
  servicioSoloPlan: ServicioPlan[] = [];
  duracionMes: DuracionMes[] = [];

  costo: number = 0.00;
  total: number = 0.00;

  detalle_afiliado = new FormControl();
  newDetalleServicio: TableServicios[] = [];

  verificacionAfiliacion: boolean = false;
  mensajeVerificacion: string = '';

  //cliente_idGlobal: number = 0;

  servicioDescripcion: string[] = [];

  iconoResp : string = '';
  colorResp : string = '';

  constructor(
    private _as: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private _afi: AfiliateService,
    private _ats: AlertService,
    private _gs: GeneralService

  ) { }
 
  ngOnInit() {
    this.formInit();
    //this.setAfiliacion(); 
  }

  ionViewDidEnter() {
    this.formInit();
    this.setAfiliacion();

    this.verificacionClienteAfilicacion();

    this.changePrecioServicioPlanCostoMensual();
  }
  
  /* ngAfterViewInit(): void {
    this.verificacionClienteAfilicacion();
  } */

  verificacionClienteAfilicacion() {
    const cliente_idGlobal = this.formAfilicacion.get('cliente_id')?.value;

    this._afi.verificacionAfiliacion(cliente_idGlobal).subscribe({
      next: (resp) => {
        if (resp.afiliado === false) {//no tiene afiliacion
          this.verificacionAfiliacion = true;
          this.mensajeVerificacion = resp.message;
          this.iconoResp = resp.icono;
          this.colorResp = resp.color;
          this.mostrarEstadoCivil();
          this.mostrarParentesco();
          this.mostrarServicioSoloPlan();
          this.mostrarDuracionMes();
        } else {//si tiene afilicacion
          this.iconoResp = resp.icono;
          this.colorResp = resp.color;
          this.verificacionAfiliacion = false;
          this.mensajeVerificacion = resp.message;
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  ngAfterContentInit(): void {
    this.changePrecioServicioPlanCostoMensual();
  }

  formInit() {
    this.formAfilicacion = this.fb.group({
      //persona
      cedula: ['', [Validators.required]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      direccion: [''],
      //user
      email: ['', [Validators.required]],
      //afiliado
      cliente_id: [''],
      estado_civil_id: ['', [Validators.required]],
      //contacto_emergencia
      parentesco_id: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      num_celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      //detalle_afiliado
      servicio_id: ['',],
      duracion_mes_id: ['',],
      //costo_mensual : [''],//opcional
      precio_servicio: [''],//opcional
      duracion: [''],//opcional
      nombre_servicio: [''],//opcional
      detalle_afiliado: this.fb.array([], [Validators.required])
    });
  }

  setAfiliacion() {
    if (this._as.tokenDecodificado != null) {
      this.dataCliente = this._as.tokenDecodificado.user;
      
      const { email, persona: { cedula, nombres, apellidos, celular, direccion, cliente } } = this.dataCliente;
      let cliente_id = null;

      if (cliente && cliente.length > 0) {
        cliente_id = cliente[0].id;
      }

      let data = { 
        cedula : cedula ?? '', 
        nombres : nombres ?? '',
        apellidos : apellidos ?? '', 
        celular : celular ?? '', 
        direccion : direccion ?? '', 
        email, 
        cliente_id 
      };

      this.formAfilicacion.patchValue(data);
    }

  }

  mostrarEstadoCivil() {
    this._afi.getEstadoCivil().subscribe({
      next: (resp) => { this.estadoCivil = resp.data; },
      error: (err) => { console.log(err); }
    })
  }

  mostrarParentesco() {
    this._afi.getParentesco().subscribe({
      next: (resp) => { this.parentesco = resp.data; },
      error: (err) => { console.log(err); }
    })
  }

  mostrarServicioSoloPlan() {
    this._afi.getServicioPlan().subscribe({
      next: (resp) => { this.servicioSoloPlan = resp.data; },
      error: (err) => { console.log(err); }
    })
  }

  mostrarDuracionMes() {
    this._afi.getDuracionMes().subscribe({
      next: (resp) => { this.duracionMes = resp.data; },
      error: (err) => { console.log(err); }
    })
  }

  changePrecioServicioPlanCostoMensual() {
    this.formAfilicacion.get('servicio_id')?.valueChanges.subscribe(servicioId => {
      console.log('servicio_id',servicioId);
      
      const precio = this.getPrecioServicio(servicioId);
      const nombreServicio = this.getNombreServicio(servicioId);

      this.formAfilicacion.get('nombre_servicio')?.setValue(nombreServicio);
      this.formAfilicacion.get('precio_servicio')?.setValue(precio);

      // Obtener la descripción del servicio seleccionado
      const descripcionServicio = this.getDescripcionServicio(servicioId);

      // Separar la descripción por comas y almacenar en un array
      this.servicioDescripcion = descripcionServicio.split(",");
    });

    this.formAfilicacion.get('duracion_mes_id')?.valueChanges.subscribe(duracionMesId => {
      const duracion = this.getCostoMensual(duracionMesId);
      this.formAfilicacion.get('duracion')?.setValue(duracion);
    });
  }

  getPrecioServicio(servicioId: number): number {
    const servicio = this.servicioSoloPlan.find(s => s.id === servicioId);
    return servicio ? servicio.precio : 0;
  }

  getNombreServicio(servicioId: number): string {
    const servicio = this.servicioSoloPlan.find(s => s.id === servicioId);
    return servicio ? servicio.nombre : '';
  }

  getCostoMensual(duracionMesId: number): number {
    const duracion = this.duracionMes.find(d => d.id === duracionMesId);
    return duracion ? duracion?.duracion : 0;
  }

  getDescripcionServicio(servicioId: number): string {
    const servicio = this.servicioSoloPlan.find(servicio => servicio.id === servicioId);
    return servicio ? servicio.descripcion : '';
  }

  addServicio() {
    const form = this.formAfilicacion.value;

    const arrayDetalleAfiliado = <FormArray>this.formAfilicacion.get('detalle_afiliado');

    this.costo = Number((form.precio_servicio / form.duracion).toFixed(2));

    const objTable: TableServicios = {
      servicio_id: form.servicio_id,
      nombre_servicio: form.nombre_servicio,
      duracion_mes_id: form.duracion_mes_id,
      duracion: form.duracion,
      costo: this.costo,
      precio_servicio: form.precio_servicio
    }
    this.procesandoTable(arrayDetalleAfiliado, objTable);
    this.formAfilicacion.get('servicio_id')?.setValue('');
    this.formAfilicacion.get('duracion_mes_id')?.setValue('');
  }

  procesandoTable(arrayDetalleAfiliado: FormArray, objTable: TableServicios) {
    if (arrayDetalleAfiliado.controls.length > 0) {
      let i: number = 0;
      arrayDetalleAfiliado.controls.forEach((item: AbstractControl) => {
        if (item.value.nombre_servicio === objTable.nombre_servicio && item.value.duracion === objTable.duracion) {
          this._ats.toastAlertWarning(`Ya existe el servicio ${this._gs.titlecase(objTable.nombre_servicio)}`);
          arrayDetalleAfiliado.removeAt(i);
          return;
        }

        if (item.value.nombre_servicio === objTable.nombre_servicio && item.value.duracion !== objTable.duracion) {
          this._ats.toastAlertWarning(
            `Ya existe el servicio ${this._gs.titlecase(objTable.nombre_servicio)}, pero se actualizo la duración y el costo mensual`,
            'warning',
            'warning-outline'
          );
          arrayDetalleAfiliado.removeAt(i);
          return;
        }

        i++;
      });

      arrayDetalleAfiliado.push(new FormControl(objTable));
      this.newDetalleServicio = arrayDetalleAfiliado.value;
      this.total = this.newDetalleServicio.reduce((total, item) => total + item.costo, 0);

    } else {
      arrayDetalleAfiliado.push(new FormControl(objTable));
      this.newDetalleServicio = arrayDetalleAfiliado.value;
      this.total = this.newDetalleServicio.reduce((total, item) => total + item.costo, 0);
    }
  }

  saveAfiliacion() {
    this.formAfilicacion.markAllAsTouched();
    if (this.formAfilicacion.invalid) { return; }

    if (this.formAfilicacion.valid) {
      const data = this.armarObj();
      this.guardandoAfiliacion(data);
    }

  }

  armarObj(): AfiliacionData {
    const form = this.formAfilicacion.value;

    const json: AfiliacionData = {
      persona: {
        cedula: form.cedula,
        nombres: form.nombres,
        apellidos: form.apellidos,
        celular: form.celular,
        direccion: form.direccion
      },
      cliente: {
        cliente_id: form.cliente_id
      },
      user: {
        email: form.email
      },
      afiliado: {
        cliente_id: form.cliente_id,
        estado_civil_id: form.estado_civil_id,
      },
      contacto_emergencia: {
        parentesco_id: form.parentesco_id,
        nombre: form.nombre,
        num_celular: form.num_celular,
      },
      detalle_afiliado: form.detalle_afiliado
    }
    return json;
  }

  guardandoAfiliacion(data: AfiliacionData) {
    this._afi.saveAfiliacion(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this._ats.toastAlert(resp.message);
          this.verificacionClienteAfilicacion();
          this.newDetalleServicio = [];
          this.total = 0;
        } else {
          this._ats.toastAlertDanger(resp.message);
        }
      },
      error: (err) => { console.log(err); },
      complete: () => { this.router.navigate(['/home']) }
    });
  }


  eliminarServicio(data: TableServicios) {
    const arrayDetalleAfiliado = <FormArray>this.formAfilicacion.get('detalle_afiliado');

    arrayDetalleAfiliado.controls.forEach((item, index) => {
      if (item.value.servicio_id === data.servicio_id) {
        arrayDetalleAfiliado.removeAt(index);
        this._ats.toastAlertDanger(`El servicio ${this._gs.titlecase(data.nombre_servicio)}, ah sido eliminado`);
        this.newDetalleServicio = arrayDetalleAfiliado.value;
        this.total = this.newDetalleServicio.reduce((total, item) => total + item.costo, 0);

        return;
      }
    });
  }

  regresar() {
    this.router.navigate(['/home']);
  }



}
