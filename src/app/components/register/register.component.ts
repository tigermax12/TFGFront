import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from 'src/app/shared/token.service';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: any = null;
  hidePassword = true;
  hideConfirm = true; 
  currentUserRole = '';
  selectedImage: File | null = null;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private tokenService: TokenService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero_trabajador: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      c_password: ['', Validators.required],
    });
  }

  ngOnInit() {
    const user = this.tokenService.getUser();
    this.currentUserRole = user?.rol.toLowerCase() || '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onSubmit() {
  const formData = new FormData();

  Object.entries(this.registerForm.value).forEach(([key, value]) => {
  formData.append(key, String(value));
});

  if (this.selectedImage) {
    formData.append('profile_image', this.selectedImage);
  }

  this.errors = null; // Limpiar errores previos

  this.authService.register(formData).subscribe(
    (result) => {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El usuario ha sido registrado correctamente.',
      });
      this.registerForm.reset();
      this.router.navigate(['users']);
    },
    (error) => {
      if (error.status === 400 && error.error) {
        this.errors = error.error;

        const formattedErrors = Object.entries(error.error)
          .map(([key, value]) => `• ${(value as string[])[0]}`)
          .join('<br>');

        Swal.fire({
          icon: 'error',
          title: 'Errores en el formulario',
          html: formattedErrors, // usa 'html' en vez de 'text' para soportar saltos de línea
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: error.error?.message || 'Ocurrió un error inesperado.',
        });
      }
    }
  );
}

}
