import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service'; 
import { environment } from 'src/environments/environment'; 
import { OrdenService } from '../orden.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenService } from 'src/app/shared/token.service';


@Component({
  selector: 'app-ver-orden',
  templateUrl: './ver-orden.component.html',
  styleUrls: ['./ver-orden.component.css']
})
export class VerOrdenComponent implements OnInit, AfterViewInit {
  ordenes: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id_orden',
    'tipo_de_orden',
    'prioridad',
    'estado',
    'nombre_operario',
    'acciones'
  ];

  ordenSeleccionada: any = null;
  detallesOrden: any = null;
  tipoSeleccionado: string = '';
  mostrarModal: boolean = false;
  detallesKeys: string[] = [];
  usuarioSeleccionado: number | null = null;
  contrasenaIngresada: string = '';
  listaUsuarios: any[] = [];
  mostrarModalFinalizar: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  currentUserRole= '';
  filtro = {
    tipo_de_orden: '',
    estado: '',
    tipo_fecha: '', // puede ser 'creacion' | 'realizacion' | 'finalizacion'
    fecha_inicio: null as Date | null,
    fecha_fin: null as Date | null
  };
  mostrarFiltrosFecha = false;
  filtroAplicado = false;
  constructor(
    private ordenService: OrdenService,
    private http: HttpClient,
    private auth: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const user = this.tokenService.getUser();
    this.currentUserRole = user?.rol?.toLowerCase() || '';
    this.cargarOrdenes();
    this.auth.getAllUsers().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
    this.dataSource.filterPredicate = this.crearFiltroPersonalizado();
  }
  aplicarFiltro() {
  this.filtroAplicado = true;
  this.dataSource.filter = JSON.stringify(this.filtro);
  }
limpiarFiltros() {
  this.filtro = {
    tipo_de_orden: '',
    estado: '',
    tipo_fecha: '',
    fecha_inicio: null,
    fecha_fin: null
  };
  this.mostrarFiltrosFecha = false;
  this.filtroAplicado = false;
  this.dataSource.filter = '';
}

onTipoFechaChange() {
  if (this.filtro.tipo_fecha) {
    this.mostrarFiltrosFecha = true;
    this.filtro.fecha_inicio = null;
    this.filtro.fecha_fin = null;
  } else {
    this.mostrarFiltrosFecha = false;
  }
  this.aplicarFiltro();
}
  crearFiltroPersonalizado() {
  return (data: any, filter: string): boolean => {
    const filtroObj = JSON.parse(filter);

    const coincideTipo = !filtroObj.tipo_de_orden || data.tipo_de_orden?.toLowerCase() === filtroObj.tipo_de_orden.toLowerCase();
    const coincideEstado = !filtroObj.estado || data.estado?.toLowerCase() === filtroObj.estado.toLowerCase();

    let coincideFecha = true;

    if (filtroObj.tipo_fecha && (filtroObj.fecha_inicio || filtroObj.fecha_fin)) {
      // Definimos un tipo para las claves válidas
      const tipoFechaValidos = ['creacion', 'realizacion', 'finalizacion'] as const;
      type TipoFecha = typeof tipoFechaValidos[number];
      
      // Verificamos que el tipo_fecha sea válido
      const tipoFecha: TipoFecha | undefined = tipoFechaValidos.includes(filtroObj.tipo_fecha) 
        ? filtroObj.tipo_fecha as TipoFecha 
        : undefined;

      if (tipoFecha) {
        const fechaCampoMap = {
          creacion: data.fecha_de_creacion,
          realizacion: data.fecha_de_realizacion,
          finalizacion: data.fecha_de_finalizacion
        };
        
        const fechaCampo = fechaCampoMap[tipoFecha];

        if (fechaCampo) {
          const fecha = new Date(fechaCampo);
          const desde = filtroObj.fecha_inicio ? new Date(filtroObj.fecha_inicio) : null;
          const hasta = filtroObj.fecha_fin ? new Date(filtroObj.fecha_fin) : null;

          coincideFecha =
            (!desde || fecha >= desde) &&
            (!hasta || fecha <= hasta);
        }
      }
    }

    return coincideTipo && coincideEstado && coincideFecha;
  };
}


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  cargarOrdenes() {
    this.ordenService.listarOrdenes().subscribe((data: any) => {
    const puedeVerFinalizadas = ['supervisor', 'encargado'].includes(this.currentUserRole);
    this.ordenes = data.filter((orden: any) => {
      return puedeVerFinalizadas || orden.estado?.toLowerCase() !== 'finalizado';
    });
    this.dataSource.data = this.ordenes;
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
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrarModal();
    }
  }

  validarYAsignar() {
    this.http.post(`${environment.apiUrl}/ordendetrabajo/autoasignar`, {
      user_id: this.usuarioSeleccionado,
      password: this.contrasenaIngresada,
      orden_id: this.ordenSeleccionada?.id_orden
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
    const datos = this.ordenSeleccionada[tipo];
  
    this.ordenService.actualizarOrden(id, tipo, datos).subscribe({
      next: () => alert(`Datos de ${tipo} actualizados correctamente.`),
      error: (error) => {
        console.error(error);
        alert(`Error al guardar los cambios de ${tipo}.`);
      }
    });
  }
  abrirFinalizarModal() {
    this.mostrarModalFinalizar = true;
  }
  
  cerrarFinalizarModal() {
    this.mostrarModalFinalizar = false;
  }
  finalizarOrden() {
    if (!this.ordenSeleccionada?.id_orden) return;
  
    this.ordenService.finalizarOrden(this.ordenSeleccionada.id_orden).subscribe({
      next: () => {
        // ⚙️ Actualizar estado localmente
        this.ordenSeleccionada.estado = 'finalizado';
  
        // 🧼 Resetear vista como si estuviera en estado "pendiente"
        this.mostrarModalFinalizar = false;
  
        alert('Orden finalizada correctamente.');
  
        // Esto fuerza que la vista se actualice como si fuera "pendiente"
        // por ejemplo: sin edición habilitada, solo vista
      },
      error: (err) => {
        console.error('Error al finalizar la orden', err);
        alert('Hubo un error al finalizar la orden.');
      }
    });
  }

}
