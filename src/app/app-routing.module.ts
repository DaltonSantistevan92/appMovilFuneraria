import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from './components/no-page/no-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AutoLoginGuard } from './auth/guards/auto-login.guard';

const routes: Routes = [
  {path: '', redirectTo: '/bienvenido', pathMatch : 'full' },
  {
    path: 'bienvenido', 
    loadChildren: () => import('./auth/auth.module').then(m=> m.AuthModule),
    canActivate : [AutoLoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate : [AuthGuard]
  },
  {path:'404', component:NoPageComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
