import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenDeTrabajo } from '../ordenes/orden.model';
@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })

export class OrdenService {
  apiUrl = 'http://127.0.0.1:8000/api/ordendetrabajo';

  constructor(private http: HttpClient) {}

  crearOrden(orden: OrdenDeTrabajo) {
    return this.http.post(this.apiUrl, orden);
  }

  listarOrdenes() {
    return this.http.get<OrdenDeTrabajo[]>(this.apiUrl);
  }

  asignarOrden(id: number, firma: string) {
    return this.http.put(`${this.apiUrl}/${id}/asignar`, { firma });
  }
  getOrdenCompleta(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}/completa`);
  }
}
