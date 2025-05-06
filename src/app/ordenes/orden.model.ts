export interface OrdenDeTrabajo {
    id_orden?: number;
    tipoDeOrden: string;
    prioridad: number;
    estado: string;
    idUserCreador: number;
    camposTipoOrden: any;
  }