import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PeticionRoutingModule } from './peticion-routing.module';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { IndexComponent } from './index/index.component';
import { PeticionService } from './peticion.service';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    CreateComponent,
    ViewComponent,
    EditComponent,
    IndexComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    PeticionRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    // Si deseas que otros módulos puedan acceder a estos componentes, agrégalos aquí
    CreateComponent,
    ViewComponent,
    EditComponent,
    IndexComponent
  ],
  providers: [
    PeticionService
  ]
})
export class PeticionModule { }  // Aquí se declara el módulo, no una interfaz
