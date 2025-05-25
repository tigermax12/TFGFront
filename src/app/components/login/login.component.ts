import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from '../../shared/token.service';
import { AuthStateService } from '../../shared/auth-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors: any = null;
  hidePassword: boolean = true;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: [],
      password: [],
    });
  }
  ngOnInit() {}
  onSubmit() {
     this.errors = null;
    this.authService.login(this.loginForm.value).subscribe(
    (result) => {
      this.responseHandler(result);
      this.authState.setAuthState(true);
      this.loginForm.reset();
      this.router.navigate(['/profile']);
    },
    (error) => {
      this.errors = error.error;
    }
  );
  }
  // Handle response
  responseHandler(data: any) {
    this.token.handleData(data.access_token);
  }
}
