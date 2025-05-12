import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CrearOrdenComponent } from './ordenes/crear-orden/crear-orden.component';
import { VerOrdenComponent } from './ordenes/ver-orden/ver-orden.component';
import { ListarUsersComponent } from './components/listar-users/listar-users.component';
import { AuthGuard } from './guards/auth.guard'; 
/*Con ccanActivate controlo si estan logeados o no */
const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { roles: ['encargado', 'supervisor', 'operario'] } },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], data: { roles: ['encargado', 'supervisor'] } },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard], data: { roles: ['encargado', 'supervisor', 'operario'] } },
    { path: 'users', component: ListarUsersComponent, canActivate: [AuthGuard], data: { roles: ['encargado', 'supervisor'] }},
    { path: 'crear-orden', component: CrearOrdenComponent, canActivate: [AuthGuard], data: { roles: ['encargado', 'supervisor'] } },
    { path: 'ver-ordenes', component: VerOrdenComponent, canActivate: [AuthGuard], data: { roles: ['encargado', 'supervisor', 'operario'] } },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}