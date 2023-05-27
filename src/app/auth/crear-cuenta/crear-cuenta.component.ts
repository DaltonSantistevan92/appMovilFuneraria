import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, MenuController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { Formulario } from '../interfaces/auth.interface';
import { BienvenidoComponent } from '../bienvenido/bienvenido.component';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss'],
})
export class CrearCuentaComponent  implements OnInit {
  formCrearCuenta!: FormGroup;
  hide : boolean = true;
  public bievenidoComponent! : BienvenidoComponent

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private _as: AuthService,
    private router : Router,
    private _ats : AlertService,
    private menuController: MenuController,

   
  ) { }

  ngOnInit() {
    this.menuController.enable(false);
    this.initForm();
  }

  initForm(){
    this.formCrearCuenta = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(3)] ],
			email: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
  }

  async registrar(){
    if (this.formCrearCuenta.invalid) { return; }

    if (this.formCrearCuenta.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      const form: Formulario = this.formCrearCuenta.value;
  
      this.serviceRegistrar(form);
      await loading.dismiss(); 
    } 
  }

  serviceRegistrar(form : Formulario){
    this._as.crearCuenta(form).subscribe({
      next: (resp) => { 
        if (resp.status) {
          this.formCrearCuenta.reset();
          this._ats.toastAlert(resp.message);
          this.modalCtrl.dismiss();
        }else{
          this._ats.toastAlert(resp.message,'danger','hand-right-outline');
        }
      },
      error: (err) => { console.log(err); },
      complete: () => {  
        this.router.navigate(['/bienvenido']); 
      }
    });
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

}
