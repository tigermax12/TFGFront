import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service'; 
import { environment } from 'src/environments/environment'; 
import { OrdenService } from '../orden.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenService } from 'src/app/shared/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformeOrdenComponent } from '../informe-orden/informe-orden.component';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-ver-orden',
  templateUrl: './ver-orden.component.html',
  styleUrls: ['./ver-orden.component.css']
})

export class VerOrdenComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
  mostrarModalInforme: boolean = false;
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
  fecha_creacion_inicio: null as Date | null,
  fecha_creacion_fin: null as Date | null,
  fecha_realizacion_inicio: null as Date | null,
  fecha_realizacion_fin: null as Date | null,
  fecha_finalizacion_inicio: null as Date | null,
  fecha_finalizacion_fin: null as Date | null,
  usuario_id: null as number | null 
};
  mostrarFiltrosFecha = false;
  filtroAplicado = false;
  constructor(
    private ordenService: OrdenService,
    private http: HttpClient,
    private auth: AuthService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.tokenService.getUser();
  this.currentUserRole = user?.rol?.toLowerCase() || '';

  this.displayedColumns = [
    'id_orden',
    'tipo_de_orden',
    'prioridad',
    'estado',
    'nombre_operario'
  ];

  if (['encargado', 'supervisor'].includes(this.currentUserRole)) {
    this.displayedColumns.push('fecha_de_creacion', 'fecha_de_realizacion', 'fecha_de_finalizacion');
  }

  this.displayedColumns.push('acciones');

  this.dataSource.filterPredicate = this.crearFiltroPersonalizado(); // 💡 AÑADIDO

  this.cargarOrdenes();

  this.auth.getAllUsers().subscribe({
  next: (data) => {
    this.listaUsuarios = data.filter((usuario: any) => usuario.rol === 'operario');
  },
  error: (err) => console.error('Error al cargar usuarios', err)
});

  }
  aplicarFiltro() {
    this.filtroAplicado = true;
    this.dataSource.filter = JSON.stringify(this.filtro);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  limpiarFiltros() {
  this.filtro = {
    tipo_de_orden: '',
    estado: '',
    fecha_creacion_inicio: null,
    fecha_creacion_fin: null,
    fecha_realizacion_inicio: null,
    fecha_realizacion_fin: null,
    fecha_finalizacion_inicio: null,
    fecha_finalizacion_fin: null,
    usuario_id: null
  };
  this.filtroAplicado = false;
  this.dataSource.filter = '';
}

  crearFiltroPersonalizado() {
  return (data: any, filter: string): boolean => {
    const f = JSON.parse(filter);
    
    console.log('Orden:', data); // 🔍 Verifica qué campos tiene cada orden

    const coincideTipo = !f.tipo_de_orden || data.tipo_de_orden?.toLowerCase() === f.tipo_de_orden.toLowerCase();
    const coincideEstado = !f.estado || data.estado?.toLowerCase() === f.estado.toLowerCase();

    const fechas: [string, string, string][] = [
      ['fecha_creacion_inicio', 'fecha_creacion_fin', 'fecha_de_creacion'],
      ['fecha_realizacion_inicio', 'fecha_realizacion_fin', 'fecha_de_realizacion'],
      ['fecha_finalizacion_inicio', 'fecha_finalizacion_fin', 'fecha_de_finalizacion']
    ];

    const coincideFechas = fechas.every(([inicioKey, finKey, campo]) => {
      const desde = f[inicioKey] ? new Date(f[inicioKey]) : null;
      const hasta = f[finKey] ? new Date(f[finKey]) : null;
      const valor = data[campo] ? new Date(data[campo]) : null;
      if (!valor) return true;
      return (!desde || valor >= desde) && (!hasta || valor <= hasta);
    });

    const coincideUsuario = !f.usuario_id || data.nombre_operario?.toLowerCase().includes(this.obtenerNombreOperarioPorId(f.usuario_id)?.toLowerCase() || '');


    return coincideTipo && coincideEstado && coincideFechas && coincideUsuario;
  };
}
obtenerNombreOperarioPorId(id: number | null): string | null {
  const user = this.listaUsuarios.find(u => u.id === id);
  return user ? user.name : null;
}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
  if (!this.usuarioSeleccionado || !this.contrasenaIngresada || !this.ordenSeleccionada?.id_orden) {
    alert('Faltan datos para asignar la orden.');
    return;
  }

  this.ordenService.autoasignarOrden(
    this.usuarioSeleccionado,
    this.contrasenaIngresada,
    this.ordenSeleccionada.id_orden
  ).subscribe({
    next: (res) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Orden asignada correctamente',
        confirmButtonColor: '#3085d6'
      });
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
      next: () => 
        Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Datos de tipo ${tipo} guardados correctamente`,
        confirmButtonColor: '#3085d6'
      }),
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
        
        this.cargarOrdenes();
        
        Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Orden finalizada correctamente',
        confirmButtonColor: '#3085d6'
      });
  
        // Esto fuerza que la vista se actualice como si fuera "pendiente"
        // por ejemplo: sin edición habilitada, solo vista
      },
      error: (err) => {
        console.error('Error al finalizar la orden', err);
        alert('Hubo un error al finalizar la orden.');
      }
    });
  }

  abrirModalInforme() {
  this.dialog.open(InformeOrdenComponent, {
    width: '80%',
    height: '80%',
    data: {
      ordenes: this.dataSource.filteredData
    }
  });
}

cerrarModalInforme() {
  this.mostrarModalInforme = false;
}

onClickOutsideInforme(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('modal')) {
    this.cerrarModalInforme();
  }
}
}
