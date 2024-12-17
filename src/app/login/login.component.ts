import { Component } from '@angular/core';
import { Utilisateur } from '../models/Utilisateur';
import { UtilisateurService } from '../services/Utilisateur/utilisateur.service';
import { Router } from '@angular/router';
import { PopupService } from '../services/popup/popup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  utilisateurs?: Utilisateur[];

  constructor(private utilisateurService: UtilisateurService,
              private router: Router,
              private popupService: PopupService,
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    const emailOrUsername = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
  
    // Call the backend to validate credentials and get user object
    this.utilisateurService.validateUserCredentials(emailOrUsername, password).subscribe({
      next: (user: Utilisateur) => {
        if (user) {
          console.log('User authenticated:', user);
          this.triggerSuccess('Welcome back  '+user.nom);
          // Store user information in localStorage
          localStorage.setItem('user', JSON.stringify({ id: user.id, email: user.email }));
          this.router.navigate(['/']);
        } else {
          console.log('Invalid credentials');
        }
      },
      error: (err) => {
        this.triggerError('Invalid credentials');
        console.error('Error during authentication:', err);
      }
    });
  }

  triggerSuccess(message: string) {
    this.popupService.showSuccess(message);
  }

  triggerError(message: string) {
    this.popupService.showError(message);
  }
  
}
