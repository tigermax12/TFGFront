import { Injectable } from '@angular/core';
@Injectable({
providedIn: 'root',
})
export class TokenService {
private issuer = {
  //login:  'http://98.66.136.54/api/api/login',
  login: 'http://127.0.0.1:8000/api/login',
  //register: 'http://98.66.136.54/api/api/register',
  register: 'http://127.0.0.1:8000/api/register',
  
};
constructor() {}
handleData(token: any) {
  localStorage.setItem('auth_token', token);
}
getToken() {
  return localStorage.getItem('auth_token');
}
// Verify the token
isValidToken() {
  const token = this.getToken();
  if (token) {
    const payload = this.payload(token);
    if (payload) {
      return Object.values(this.issuer).indexOf(payload.iss) > -1;
    }
  }
  return false;
}
  payload(token: any) {
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
    }
    // User state based on valid token
    isLoggedIn() {
    return this.isValidToken();
    }
    // Remove token
    removeToken() {
    localStorage.removeItem('auth_token');
    }
    getUser(): any {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}
    }