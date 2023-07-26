import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VerDetalleFechaPagosComponent } from './ver-detalle-fecha-pagos/ver-detalle-fecha-pagos.component';
import { PagosAfilicacionService } from './services/pagos-afilicacion.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseAfiliado } from './interfaces/pagos-afiliados.interface';

@Component({
  selector: 'app-pagos-afiliacion',
  templateUrl: './pagos-afiliacion.component.html',
  styleUrls: ['./pagos-afiliacion.component.scss'],
})
export class PagosAfiliacionComponent  implements OnInit {
  dataCliente!: User;
  formCliente!: FormGroup;

  afiliadoResponse : ResponseAfiliado [] = [];

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private _ps : PagosAfilicacionService,
    private _as: AuthService,
    private fb: FormBuilder,


  ) { }


  ngOnInit() {
    console.log('ngOnInit');
    this.formInit();
    this.recuperarCliente();
    this.recuperAfiliadoId();

    
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.recuperarCliente();
    this.recuperAfiliadoId();
  }


  formInit() {
    this.formCliente = this.fb.group({ cliente_id: [''], afiliado_id: [''] });
  }

  recuperarCliente() {
    if (this._as.tokenDecodificado != null) {
      this.dataCliente = this._as.tokenDecodificado.user;
      
      const { persona: {  cliente } } = this.dataCliente;
      let cliente_id = null;

      if (cliente && cliente.length > 0) {
        cliente_id = cliente[0].id;
      }
      this.formCliente.patchValue({cliente_id});
    }

  }

  recuperAfiliadoId(){
    this._ps.getAfiliadoId(parseInt(this.formCliente.value.cliente_id)).subscribe({
      next : (resp) => {
        if (resp.status) {
          let afiliado_id = resp.afiliado_id;
          console.log('afiliado_id',afiliado_id);
          this.serviciePagosxAfiliado(afiliado_id);
        } else {
          console.log(resp.message);
        }
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  serviciePagosxAfiliado(afiliado_id:number){
    this._ps.consultaAfiliadoOrTodos(afiliado_id).subscribe({
      next : (resp) => {
        if (resp.status) {
          this.afiliadoResponse = resp.data;
          console.log('consulta afiliado',resp.data);
        } else {
          console.log(resp.message);
        }
      },
      error : (err) => {
        console.log(err);
      }
    });
  }




  consultaPagosCliente(){

  }

  async irDetalle(af:ResponseAfiliado) {
    const modal = await this.modalCtrl.create({
      component: VerDetalleFechaPagosComponent,
      cssClass: 'cart-modal',
      backdropDismiss: false,
      componentProps : {afiliadoResponse : af }
    });
    modal.present();
  }

  regresar() {
    this.router.navigate(['/home']);
  }

}
