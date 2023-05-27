import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {path:'', component: BienvenidoComponent, canActivate : [AutoLoginGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
