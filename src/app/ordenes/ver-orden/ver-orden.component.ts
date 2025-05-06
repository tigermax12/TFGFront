import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service'; 
import { environment } from 'src/environments/environment'; 
import { OrdenService } from '../orden.service';
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
  usuarioSeleccionado: number | null = null;
  contrasenaIngresada: string = '';
  listaUsuarios: any[] = [];
  constructor(
    private ordenService: OrdenService,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarOrdenes();
    this.auth.getAllUsers().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  cargarOrdenes() {
    this.ordenService.listarOrdenes()
      .subscribe((data: any) => {
        this.ordenes = data;
        console.log('Órdenes recibidas:', this.ordenes);
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
  validarYAsignar() {
    const payload = {
      userId: this.usuarioSeleccionado,
      password: this.contrasenaIngresada,
      ordenId: this.ordenSeleccionada.id_orden
    };
  
    this.http.post(`${environment.apiUrl}/ordendetrabajo/autoasignar`, {
      user_id: this.usuarioSeleccionado,        // Debe ser un ID válido
      password: this.contrasenaIngresada,       // No puede estar vacío
      orden_id: this.ordenSeleccionada?.id_orden  // Debe existir en la DB
    }).subscribe({
      next: (res) => {
        console.log('Asignación exitosa', res);
        this.cargarOrdenes();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al asignar la orden', err);
        alert('Error al asignar la orden. Verifica usuario y contraseña.');
      }
    });
  }

  guardarCambios(tipo: 'limpieza' | 'trasiego' | 'clarificacion') {
    if (!this.ordenSeleccionada || !this.ordenSeleccionada.id_orden) return;
  
    const id = this.ordenSeleccionada.id_orden;
    const datos = {
      tipo_de_orden: tipo,
      ...this.ordenSeleccionada[tipo]
    };
  
    this.http.post(`http://localhost:8000/api/ordendetrabajo/actualizar-orden/${id}`, datos).subscribe({
      next: () => {
        alert(`Datos de ${tipo} actualizados correctamente.`);
      },
      error: (error) => {
        console.error(error);
        alert(`Error al guardar los cambios de ${tipo}.`);
      }
    });
  }
  
}
