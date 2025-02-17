import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class User {
  name!: string;
  email!: string;
  password!: string;
  password_confirmation!: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
// User registration
register(user: User): Observable<any> {
return this.http.post('http://127.0.0.1:8000/api/register', user);
}
// Login
login(user: User): Observable<any> {
return this.http.post<any>('http://127.0.0.1:8000/api/login',
user);
}
// Access user profile
profileUser(): Observable<any> {
return this.http.get('http://127.0.0.1:8000/api/me');
}

}
