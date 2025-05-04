import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service'; 
import { environment } from 'src/environments/environment'; 

@Component({
  selector: 'app-ver-orden',
  templateUrl: './ver-orden.component.html',
  styleUrls: ['./ver-orden.component.css']
})
export class VerOrdenComponent implements OnInit {
  ordenes: any[] = [];
  ordenSeleccionada: any = null;
  detallesOrden: any = null;
  tipoSeleccionado: string = '';
  mostrarModal: boolean = false;
  detallesKeys: string[] = [];
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.http.get(`${environment.apiUrl}/ordendetrabajo`)
      .subscribe((data: any) => {
        this.ordenes = data; // Ya que devuelve un array directo
        console.log('Órdenes recibidas:', this.ordenes);
      });
  }

  asignarOrden(ordenId: number) {
    const userId = this.auth.getUserId();
    this.http.post(`${environment.apiUrl}/ordendetrabajo/asignar`, {
      ordenId,
      operario: userId,
      firma: 'Firma del operario'
    }).subscribe(() => {
      this.cargarOrdenes();
    });
  }
  getRowColor(orden: any): string {
    if (orden.estado?.toLowerCase() === 'pendiente') {
      return 'tr-roja';
    } else if (orden.estado?.toLowerCase() === 'en proceso') {
      return 'tr-amarilla';
    }
    return '';
  }
  get ordenesOrdenadas() {
    return this.ordenes.sort((a, b) => {
      if (a.estado?.toUpperCase() === 'EN PROCESO' && b.estado?.toUpperCase() !== 'EN PROCESO') {
        return -1;
      }
      if (a.estado?.toUpperCase() !== 'EN PROCESO' && b.estado?.toUpperCase() === 'EN PROCESO') {
        return 1;
      }
      return b.prioridad - a.prioridad;
    });
  }
  abrirModal(id: number) {
    this.http.get(`${environment.apiUrl}/ordendetrabajo/${id}/completa`)
      .subscribe((res: any) => {
        this.ordenSeleccionada = res.orden;
        this.detallesOrden = res.detalles;
        this.tipoSeleccionado = res.tipo?.trim().toLowerCase();
        this.detallesKeys = Object.keys(res.detalles || {});
        this.mostrarModal = true;
      });
  }
  cerrarModal() {
    this.mostrarModal = false;
    this.ordenSeleccionada = null;
    this.detallesOrden = null;
    this.tipoSeleccionado = '';
    this.detallesKeys = [];
  }
  onClickOutside(event: MouseEvent) {
    // Cierra el modal solo si se hizo clic directamente en el fondo (no en el contenido)
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrarModal();
    }
  }
}
