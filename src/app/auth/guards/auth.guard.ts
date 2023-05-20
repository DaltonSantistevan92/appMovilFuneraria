import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _as : AuthService,
    private router : Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      
    return this._as.verificarAutenticacion().pipe(tap(estaAutenticado => {
      if(!estaAutenticado){
        localStorage.removeItem('tokenRip');
        this.router.navigate(['/bienvenido']);
      }
    }));



  }
}
