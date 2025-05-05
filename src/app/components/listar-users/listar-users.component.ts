import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService, User } from 'src/app/shared/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
@Component({
  selector: 'app-listar-users',
  templateUrl: './listar-users.component.html',
  styleUrls: ['./listar-users.component.css']
})
export class ListarUsersComponent {
  displayedColumns: string[] = ['id', 'name', 'rol', 'email', 'numero_trabajador'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
