import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component'
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { IonicModule } from '@ionic/angular';
import { EmailValidationDirective } from '../directives/email-validation.directive';


@NgModule({
  declarations: [
    LoginComponent,
    CrearCuentaComponent,
    BienvenidoComponent,
    EmailValidationDirective
  ],
  exports:[
    LoginComponent,
    CrearCuentaComponent,
    BienvenidoComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
