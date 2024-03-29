import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
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
import { PedidosComponent } from './pedidos/pedidos.component';
import { PagosAfiliacionComponent } from './pagos-afiliacion/pagos-afiliacion.component';
import { VerDetallePedidoComponent } from './pedidos/ver-detalle-pedido/ver-detalle-pedido.component';
import { VerDetalleFechaPagosComponent } from './pagos-afiliacion/ver-detalle-fecha-pagos/ver-detalle-fecha-pagos.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
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
    PedidosComponent,
    PagosAfiliacionComponent,
    VerDetallePedidoComponent,
    CedulaDirective,
    SoloNumerosDirective,
    NumerosCelularEcuadorDirective,
    SoloLetrasDirective,
    AlfaNumericoDirective,
    VerDetalleFechaPagosComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DatePipe
  ]
})
export class HomePageModule {}
