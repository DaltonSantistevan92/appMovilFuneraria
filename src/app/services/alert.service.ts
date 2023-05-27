import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

    
  constructor(private toast:ToastController,) { }

  async toastAlert(texto: string, color: string = 'success', icon : string = 'checkmark-outline') {
    let t = await this.toast.create({
      message: texto,
      color: color,
      duration: 1500,
      mode : "ios",
      icon : icon 
    });
    t.present();
  }


  async toastAlertWarning(texto: string, color: string = 'warning', icon : string = 'hand-right-outline') {
    let t = await this.toast.create({
      message: texto,
      color: color,
      duration: 2500,
      mode : "ios",
      icon : icon 
    });
    t.present();
  }


  async toastAlertDanger(texto: string, color: string = 'danger', icon : string = 'close-outline') {
    let t = await this.toast.create({
      message: texto,
      color: color,
      duration: 1500,
      mode : "ios",
      icon : icon 
    });
    t.present();
  }
}
