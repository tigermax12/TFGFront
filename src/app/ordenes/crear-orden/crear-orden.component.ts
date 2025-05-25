import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { OrdenService } from '../orden.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-crear-orden',
  templateUrl: './crear-orden.component.html',
  styleUrls: ['./crear-orden.component.css']
})
export class CrearOrdenComponent {
  ordenForm: FormGroup;
  tipoSeleccionado = '';
  prioridades = [1, 2, 3, 4, 5];
  
  constructor(private fb: FormBuilder, private ordenService: OrdenService, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user.id;
    this.ordenForm = this.fb.group({
      tipoDeOrden: ['', Validators.required],
      prioridad: [null, Validators.required],
      fecha_de_realizacion: [null],
      idUserCreador: [userId],
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
    const formValue = { ...this.ordenForm.value };
  
    // Formatear fecha
    if (formValue.fecha_de_realizacion instanceof Date) {
      const date = formValue.fecha_de_realizacion;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formValue.fecha_de_realizacion = `${year}/${month}/${day}`;
    }
  
    formValue.estado = 'pendiente';
  
    this.ordenService.crearOrden(formValue).subscribe({
  next: () => {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Orden creada con éxito',
      confirmButtonColor: '#3085d6'
    }).then(() => {
      this.router.navigate(['/ver-ordenes']);
    });
  },
  error: err => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al crear la orden: Debes rellenos los campos Tipo de orden, Priodad y Fecha de realizacion' ,
      confirmButtonColor: '#d33'
    });
  }
});
  }
  
  
}
