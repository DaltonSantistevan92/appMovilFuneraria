import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from './services/pedidos.service';
import { map } from 'rxjs';
import { Estado, Pedido, Ventaubicacion } from './interfaces/pedidos.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { VerDetallePedidoComponent } from './ver-detalle-pedido/ver-detalle-pedido.component';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent  implements OnInit {

  verificacion : boolean = false;

  formPedido! : FormGroup;

  customPopoverOptions = {
    header: 'FECHA DEL PEDIDO',
  };

  customPopoverOptions2 = {
    header: 'ESTADO DEL PEDIDO',
  };

  estados : Estado [] = [];
  dataCliente!: User;

  dataPedido : Pedido [] = [];

  statusDescription : string = '';

  pipe = new DatePipe('es-EC');



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _ps : PedidosService,
    private _as: AuthService,
    private modalCtrl: ModalController,


  ) { }

  ngOnInit() {
    this.initForm();
    this.getEstados();
    this.setCliente();

    const estadoIdControl = this.formPedido.get('estado_id');
    // Desactivar el segundo select al iniciar el componente
    estadoIdControl?.disable();
  
    this.formPedido.get('select_fecha')?.valueChanges.subscribe(value => {
      if (value) {
        estadoIdControl?.enable();
      } else {
        estadoIdControl?.disable();
      }
    });

    this.formPedido.get('estado_id')?.valueChanges.subscribe(estado_id => {
      if (estado_id) {
        this.getPedidos(this.formPedido.get('cliente_id')?.value,estado_id,parseInt(this.formPedido.get('select_fecha')?.value));
      }
    });
    

  }

  
  ionViewDidEnter() {
    this.initForm();
    this.getEstados();
    this.setCliente();

    const estadoIdControl = this.formPedido.get('estado_id');
    // Desactivar el segundo select al iniciar el componente
    estadoIdControl?.disable();
  
    this.formPedido.get('select_fecha')?.valueChanges.subscribe(value => {
      if (value) {
        estadoIdControl?.enable();
      } else {
        estadoIdControl?.disable();
      }
    });

    this.formPedido.get('estado_id')?.valueChanges.subscribe(estado_id => {
      if (estado_id) {
        this.getPedidos(this.formPedido.get('cliente_id')?.value,estado_id,parseInt(this.formPedido.get('select_fecha')?.value));
      }
    });
  }

  initForm(){
    this.formPedido = this.fb.group({
      cliente_id : [''],
      select_fecha: ['', [Validators.required]],
      estado_id: ['', [Validators.required]],
    });
  }

  setCliente() {
    if (this._as.tokenDecodificado != null) {
      this.dataCliente = this._as.tokenDecodificado.user;
      
      const { persona: { cliente } } = this.dataCliente;
      let cliente_id = null;

      if (cliente && cliente.length > 0) {
        cliente_id = cliente[0].id;
      }

      this.formPedido.patchValue({cliente_id});
    }

  }

  getEstados() {
    this._ps.getEstados().pipe(
      map((resp) => resp.data.filter((estado) => [1, 2, 3, 6].includes(estado.id)).sort((a, b) => a.detalle.localeCompare(b.detalle)))
    ).subscribe({
      next: (estadosFiltradosOrdenados) => {
        this.estados = estadosFiltradosOrdenados;
      },
      error: (err) => { console.log(err); }
    });
  }

  getPedidos(cliente_id: number, estado_id: number, select_fecha_id : number){
    this._ps.verPedidos(cliente_id,estado_id,select_fecha_id).subscribe({
      next : (resp) => {
        if (resp.status) {
          this.verificacion = true;
          this.dataPedido = resp.data; 
          this.statusDescription = resp.estado;
        } else {
          this.verificacion = false;
        }
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  diaFechaPersonalizada(created_at : string){
    const fechaFormateada = this.pipe.transform(created_at, 'EEEE. dd/MM/yyyy');
    return fechaFormateada;
  }

  ubicacion(ventaUbicacion : Ventaubicacion){
    const ubicacion = `${ventaUbicacion.provincia.provincia} - ${ventaUbicacion.canton} - ${ventaUbicacion.parroquia}`;
    return ubicacion;
  }

  async verDetallePedido(pedido : Pedido){
    const modal = await this.modalCtrl.create({
      component: VerDetallePedidoComponent,
      cssClass: 'cart-modal',
      backdropDismiss: false,
      componentProps : {
        pedido : pedido
      }
    });
    modal.present();

  }


  regresar() {
    this.formPedido.get('select_fecha')?.setValue('');
    this.formPedido.get('estado_id')?.setValue('');
    this.router.navigate(['/home']);
  }

}
