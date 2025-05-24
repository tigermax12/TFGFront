import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
form: FormGroup;

constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password_confirmation: ['', Validators.required],
    });
  }

  onChangePassword() {
    if (this.form.value.new_password !== this.form.value.new_password_confirmation) {
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las nuevas contraseñas no coinciden.',
            confirmButtonColor: '#d33'
          });
      alert();
      return;
    }

    this.authService.changePassword(this.form.value).subscribe({
      next: (res) => {
        Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Contraseña actualizada correctamente.',
              confirmButtonColor: '#3085d6'
            });
        this.dialogRef.close();
      },
      error: (err) => {
        alert(err.error?.error || 'Error al cambiar la contraseña.');
      }
    });
  }
}
