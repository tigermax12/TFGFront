import { Component, Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-informe-orden',
  templateUrl: './informe-orden.component.html',
  styleUrls: ['./informe-orden.component.css']
})
export class InformeOrdenComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<InformeOrdenComponent>,
) {}
exportarAExcel(): void {
    const datos = this.data.ordenes.map((o: any) => ({
      'ID Orden': o.id_orden,
      'Tipo': o.tipo_de_orden,
      'Prioridad': o.prioridad,
      'Estado': o.estado,
      'Operario': o.nombre_operario || 'Sin asignar',
      'Fecha Creación': o.fecha_de_creacion,
      'Fecha Realización': o.fecha_de_realizacion,
      'Fecha Finalización': o.fecha_de_finalizacion
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const workbook: XLSX.WorkBook = { Sheets: { 'Órdenes': worksheet }, SheetNames: ['Órdenes'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'informe_ordenes.xlsx');
    
    // Cierra el diálogo después de exportar
    this.dialogRef.close();
  }
}
