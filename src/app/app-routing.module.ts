import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CrearOrdenComponent } from './ordenes/crear-orden/crear-orden.component';
import { VerOrdenComponent } from './ordenes/ver-orden/ver-orden.component';
import { ListarUsersComponent } from './components/listar-users/listar-users.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'users', component: ListarUsersComponent, canActivate: [AuthGuard]},
    { path: 'crear-orden', component: CrearOrdenComponent, canActivate: [AuthGuard] },
    { path: 'ver-ordenes', component: VerOrdenComponent, canActivate: [AuthGuard] },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}