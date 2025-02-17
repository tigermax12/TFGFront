import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peticion } from './peticion';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {
  private apiUrl = 'http://127.0.0.1:8000/api/peticiones'; 

  constructor(private http: HttpClient) {}

  createPeticion(peticion: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.apiUrl, peticion, { headers });
  }
  getPeticiones(): Observable<Peticion[]> {
    return this.http.get<Peticion[]>(this.apiUrl);
  }
  getPeticion(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}
