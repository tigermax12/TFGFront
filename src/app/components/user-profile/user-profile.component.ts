import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';

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
    constructor(public authService: AuthService, private router: Router) {
        this.authService.profileUser().subscribe((data: any) => {
          this.UserProfile = data;
          console.log(this.UserProfile);
        });
      }
    
      ngOnInit() {}
    
      onSignOut() {
        this.authService.signOut();
      }
}
