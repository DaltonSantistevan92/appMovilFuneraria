import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NewDirectiveModule } from '../new-directive/new-directive.module';//sin utilizar

import { BannerComponent } from './banner/banner.component';
import { CategoriaProductoComponent } from './categoria-producto/categoria-producto.component';
import { DetalleComponent } from './detalle/detalle.component';
import { AfiliateComponent } from './afiliate/afiliate.component';
import { BannerPlanComponent } from './banner-plan/banner-plan.component';

import { AuthModule } from '../auth/auth.module';

import { CedulaDirective } from '../directives/cedula.directive';
import { SoloNumerosDirective } from '../directives/solo-numeros.directive';
import { NumerosCelularEcuadorDirective } from '../directives/numeros-celular-ecuador.directive';
import { SoloLetrasDirective } from '../directives/solo-letras.directive';
import { AlfaNumericoDirective } from '../directives/alfa-numerico.directive';
import { VerificarComponent } from './verificar/verificar.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    NewDirectiveModule,
    AuthModule,//utilizo la directiva 
    
  ],
  declarations: [
    HomePage,
    BannerComponent,
    CategoriaProductoComponent,
    DetalleComponent, 
    AfiliateComponent,
    BannerPlanComponent,
    VerificarComponent,
    CedulaDirective,
    SoloNumerosDirective,
    NumerosCelularEcuadorDirective,
    SoloLetrasDirective,
    AlfaNumericoDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
