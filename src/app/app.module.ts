import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth-interceptor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PeticionModule } from './peticion/peticion.module';
import { PeticionRoutingModule } from './peticion/peticion-routing.module';
import { PeticionService } from './peticion/peticion.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,  
    FormsModule,   
    RouterModule,  
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PeticionModule,
    PeticionRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    PeticionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
