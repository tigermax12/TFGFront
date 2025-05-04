export interface OrdenDeTrabajo {
    id_orden?: number;
    tipoDeOrden: string;
    prioridad: string;
    estado: string;
    idUserCreador: number;
    camposTipoOrden: any;
  }