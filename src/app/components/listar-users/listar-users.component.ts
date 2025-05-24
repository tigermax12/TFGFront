import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService, User } from 'src/app/shared/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-listar-users',
  templateUrl: './listar-users.component.html',
  styleUrls: ['./listar-users.component.css']
})

export class ListarUsersComponent {
  displayedColumns: string[] = ['id', 'name', 'rol', 'email', 'numero_trabajador', 'acciones'];

  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private dialog: MatDialog,
  private snackBar: MatSnackBar,
  ) {}

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
    this.dataSource.paginator = this.paginator;
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  confirmarEliminacion(user: User): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { nombre: user.name }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
        },
        error: err => {
          this.snackBar.open('Error: ' + err.error.error, 'Cerrar', { duration: 5000 });
        }
      });
    }
  });
}

}
