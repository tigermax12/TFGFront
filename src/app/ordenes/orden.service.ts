import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenDeTrabajo } from '../ordenes/orden.model';
@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })

export class OrdenService {
  //apiUrl = 'http://98.66.136.54/api/api/ordendetrabajo';
  apiUrl = 'http://127.0.0.1:8000/api/ordendetrabajo';

  constructor(private http: HttpClient) {}

  crearOrden(orden: OrdenDeTrabajo) {
    return this.http.post(this.apiUrl, orden);
  }

  listarOrdenes() {
    return this.http.get(`${this.apiUrl}`);
  }

  asignarOrden(id: number, firma: string) {
    return this.http.put(`${this.apiUrl}/${id}/asignar`, { firma });
  }
  getOrdenCompleta(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}/completa`);
  }

  actualizarOrden(id: number, tipo: string, datos: any) {
    const payload = {
      tipo_de_orden: tipo,
      ...datos
    };
    return this.http.post(`${this.apiUrl}/actualizar-orden/${id}`, payload);
  }
  finalizarOrden(id_orden: number) {
    return this.http.post(`${this.apiUrl}/${id_orden}/finalizar`, {});
  }
  autoasignarOrden(user_id: number, password: string, orden_id: number) {
  const payload = { user_id, password, orden_id };
  return this.http.post(`${this.apiUrl}/autoasignar`, payload);
}
}
