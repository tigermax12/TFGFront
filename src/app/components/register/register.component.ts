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
export class RegisterComponent implements
  OnInit {
  registerForm: FormGroup;
  errors: any = null;
  hidePassword = true;
  hideConfirm = true; 
  currentUserRole= '';
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
  onSubmit() {
    this.authService.register(this.registerForm.value).subscribe(
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