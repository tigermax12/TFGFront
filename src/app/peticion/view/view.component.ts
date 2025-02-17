import { Component, OnInit } from '@angular/core';
import { PeticionService } from 'src/app/peticion/peticion.service';
import { Peticion } from '../peticion';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  peticion: any;
  error: string = '';
  loading: boolean = true;

  constructor(
    private peticionService: PeticionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.peticionService.getPeticion(Number(id)).subscribe(
        (data) => {
          this.peticion = data;
          this.loading = false;
        },
        (error) => {
          this.error = 'Petición no encontrada';
          this.loading = false;
        }
      );
    }
  }
}
