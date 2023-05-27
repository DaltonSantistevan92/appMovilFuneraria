import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  menus : Menu [] = [];
  nombre : string = '';

  constructor(
    private _as : AuthService
  ) { }

  ngOnInit() {
    this._as.$getObjSourcePayload.subscribe((resp) => { 
      this.menus = resp.menu;
      this.nombre = resp.user?.name; 
    });
 
    if (this._as.tokenDecodificado != null) {
      this.menus = this._as.tokenDecodificado.menu;
      this.nombre = this._as.tokenDecodificado.user?.name;  
    }

  }

}
