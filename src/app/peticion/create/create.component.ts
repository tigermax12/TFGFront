import { Component } from '@angular/core';
import { PeticionService } from 'src/app/peticion/peticion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  peticionForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private peticionService: PeticionService) {
    this.peticionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: ['', Validators.required],
      destinatario: ['', Validators.required],
      categoria_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  crearPeticion() {
    if (this.peticionForm.invalid) {
      this.mensaje = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    this.peticionService.createPeticion(this.peticionForm.value).subscribe({
      next: () => {
        this.mensaje = '✅ Petición creada con éxito!';
        this.peticionForm.reset();
      },
      error: () => {
        this.mensaje = '❌ Ocurrió un error al crear la petición.';
      }
    });
  }
}
