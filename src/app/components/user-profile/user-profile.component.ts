import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
// User interface
export class User {
  name?: string;
  email?: string;
  rol?: string;
  numero_trabajador?: string;
  profile_image_url?: string;
}
@Component({
selector: 'app-user-profile',
templateUrl: './user-profile.component.html',
styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
    UserProfile!: User;
    constructor(
      public authService: AuthService, 
      private router: Router,
      private dialog: MatDialog
    ) {
        this.authService.profileUser().subscribe((data: any) => {
          this.UserProfile = data;
          console.log(this.UserProfile);
        });
      }
    
      ngOnInit() {}
    
      onSignOut() {
        this.authService.signOut();
      }
      openChangePasswordDialog() {
      this.dialog.open(ChangePasswordDialogComponent, {
        width: '400px'
      });
    }
}
