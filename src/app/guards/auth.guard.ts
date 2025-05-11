import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router  } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../shared/token.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.tokenService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.tokenService.getUser(); // Método que deberías tener para obtener el usuario actual
    const allowedRoles = route.data['roles'] as Array<string>;

    if (allowedRoles && !allowedRoles.includes(user?.rol)) {
      this.router.navigate(['/unauthorized']); // Opcional: vista de acceso denegado
      return false;
    }

    return true;
  }
}
