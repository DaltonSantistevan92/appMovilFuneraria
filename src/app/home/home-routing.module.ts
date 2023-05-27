import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CategoriaProductoComponent } from './categoria-producto/categoria-producto.component';
import { DetalleComponent } from './detalle/detalle.component';
import { AfiliateComponent } from './afiliate/afiliate.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate : [AuthGuard],
  },
  { path : 'categoria', component : CategoriaProductoComponent,  canActivate : [AuthGuard]},
  { path : 'detalle', component : DetalleComponent,  canActivate : [AuthGuard]},
  { path : 'afiliate', component : AfiliateComponent,  canActivate : [AuthGuard]}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
