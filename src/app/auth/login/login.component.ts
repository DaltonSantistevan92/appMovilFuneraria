import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, MenuController, ModalController } from '@ionic/angular';
import { Formulario } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  formLogin!: FormGroup;
  hide : boolean = true;

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
    this.formLogin = this.fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
  }


  async login(){
    if (this.formLogin.invalid) { return; }

    if (this.formLogin.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      const form : Formulario = this.formLogin.value;
      this.serviceLogin(form);
      await loading.dismiss(); 
    }
  }

  serviceLogin(form : Formulario){
    this._as.login(form).subscribe({
      next : (resp) => { 
        if(resp.status){
          this.formLogin.reset();
          this._ats.toastAlert(resp.message);
          this.modalCtrl.dismiss();
          this.router.navigate(['/home']);
        }else{
          this._ats.toastAlert(resp.message,'danger','hand-right-outline');
        }
      },
      error : (err) => { console.log(err) }
    })

  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

}
