import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './shared/token.service';
import { AuthStateService } from './shared/auth-state.service';
import { AuthService } from './shared/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Angular App';
  isSignedIn!: boolean;
  user: any = null;
  isEncargadoOrSupervisor: boolean = false;
  constructor(
    private auth: AuthStateService,
    public router: Router,
    public token: TokenService,
    public authService: AuthService,
  ) {}
  ngOnInit() {
    this.auth.userAuthState.subscribe((val) => {
    this.isSignedIn = val;
    if (val) {
      // Si el usuario está autenticado, traemos su perfil
      this.authService.profileUser().subscribe((data) => {
        this.user = data;
      // Verificar el rol
        const role = this.user?.rol?.toLowerCase();
        this.isEncargadoOrSupervisor = role === 'encargado' || role === 'supervisor';
      });
    }
  });
  }
  // Signout
  signOut() {
      this.auth.setAuthState(false);
      this.token.removeToken();
      this.router.navigate(['login']);
    }
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  }
