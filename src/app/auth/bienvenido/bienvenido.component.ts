import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../login/login.component';
import { CrearCuentaComponent } from '../crear-cuenta/crear-cuenta.component';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.scss'],
})
export class BienvenidoComponent implements OnInit {
  private modalAbierto = false;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() { }

  async login() {
    if (!this.modalAbierto) {
      const modal = await this.modalCtrl.create({
        component: LoginComponent,
        cssClass: 'login-modal',
        animated: true,
        mode: 'ios',
        backdropDismiss: false,
      });

      this.modalAbierto = true;

      modal.onDidDismiss().then(() => { this.modalAbierto = false; });

      return await modal.present();
    }
  }

  async register() {
    if (!this.modalAbierto) {
      const modal = await this.modalCtrl.create({
        component: CrearCuentaComponent,
        cssClass: 'register-modal',
        animated: true,
        mode: 'ios',
        backdropDismiss: false,
      });

      this.modalAbierto = true;

      modal.onDidDismiss().then(() => { this.modalAbierto = false; });

      return await modal.present();
    }
  }

}
