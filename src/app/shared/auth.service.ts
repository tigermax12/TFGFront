import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';
export class User {
  id!: number;
  name!: string;
  email!: string;
  rol!: string;
  numero_trabajador!: string;
  password!: string;
  c_password!: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private authState: AuthStateService,
    private token: TokenService,
    private router: Router
  
  ) {}
// User registration
register(user: User): Observable<any> {
  console.log(user)
return this.http.post('http://127.0.0.1:8000/api/register', user);
}
// Login
login(user: User): Observable<any> {
  return this.http.post<any>('http://127.0.0.1:8000/api/login', user).pipe(
    tap((res) => {
      this.token.handleData(res.access_token); // ← Guarda el token usando el método correcto
      localStorage.setItem('user', JSON.stringify(res.user)); // ← Guarda el usuario con su rol
      this.authState.setAuthState(true); // ← Mantiene el estado de autenticación actualizado
    })
  );
}
// Access user profile
profileUser(): Observable<any> {
return this.http.get('http://127.0.0.1:8000/api/me');
}
getUserId(): Observable<number> {
  return new Observable(observer => {
    this.profileUser().subscribe({
      next: (res) => {
        observer.next(res.id);
        observer.complete();
      },
      error: (err) => {
        observer.error(err);
      }
    });
  });
}
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>('http://127.0.0.1:8000/api/index');
}
signOut() {
  this.token.removeToken();
  this.authState.setAuthState(false);
  this.router.navigate(['/login']);
}
}
