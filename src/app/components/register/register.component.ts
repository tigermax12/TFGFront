import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from 'src/app/shared/token.service';

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
      name: [''],
      rol: [''],
      email: [''],
      numero_trabajador: [''],
      password: [''],
      c_password: [''],
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
    formData.append(key, value as string); // ← Castea explícitamente a string
    });
    if (this.selectedImage) {
      formData.append('profile_image', this.selectedImage);
    }
    this.authService.register(formData).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        this.errors = error.error;
      },
      () => {
        this.registerForm.reset();
        this.router.navigate(['users']);
      }
    );
  }
}
