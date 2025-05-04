import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrdenService } from '../orden.service';

@Component({
  selector: 'app-crear-orden',
  templateUrl: './crear-orden.component.html',
  styleUrls: ['./crear-orden.component.css']
})
export class CrearOrdenComponent {
  ordenForm: FormGroup;
  tipoSeleccionado = '';

  constructor(private fb: FormBuilder, private ordenService: OrdenService) {
    this.ordenForm = this.fb.group({
      tipoDeOrden: [''],
      prioridad: [''],
      estado: [''],
      idUserCreador: [1], // ID fijo o tomado de auth
      camposTipoOrden: this.fb.group({})
    });
  }
  onTipoOrdenChange() {
    const tipo = this.ordenForm.get('tipoDeOrden')?.value;
    this.tipoSeleccionado = tipo;

    const camposForm = this.fb.group({});
    if (tipo === 'limpieza') {
      camposForm.addControl('deposito', this.fb.control(''));
      camposForm.addControl('tipo_de_limpieza', this.fb.control(''));
      camposForm.addControl('observaciones', this.fb.control(''));
    }
    if (tipo === 'trasiego') {
      camposForm.addControl('producto', this.fb.control(''));
      camposForm.addControl('deposito_origen', this.fb.control(''));
      camposForm.addControl('deposito_destino', this.fb.control(''));
      camposForm.addControl('cantidad_a_trasegar', this.fb.control(''));
      camposForm.addControl('tipo_de_limpieza', this.fb.control(''));
      camposForm.addControl('observaciones', this.fb.control(''));
    }
    if (tipo === 'clarificacion') {
      camposForm.addControl('producto', this.fb.control(''));
      camposForm.addControl('deposito', this.fb.control(''));
      camposForm.addControl('coadyuvantes_extra', this.fb.control(''));
      camposForm.addControl('observaciones', this.fb.control(''));
    }

    this.ordenForm.setControl('camposTipoOrden', camposForm);
  }

  submit() {
    this.ordenService.crearOrden(this.ordenForm.value).subscribe({
      next: () => alert('Orden creada con éxito'),
      error: err => alert('Error: ' + err.error.error)
    });
  }
}
