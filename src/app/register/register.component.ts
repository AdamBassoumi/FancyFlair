import { Component } from '@angular/core';
import { Utilisateur } from '../models/Utilisateur';
import { UtilisateurService } from '../services/Utilisateur/utilisateur.service';
import { Router } from '@angular/router';
import { PopupService } from '../services/popup/popup.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  utilisateurs?: Utilisateur[];

  constructor(private utilisateurService: UtilisateurService,
              private router: Router,
              private popupService: PopupService,
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Get the values from the form
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (!name || !lastname || !email || !password) {
      this.popupService.showError('All fields are required');
      return;
    }
  
    // Create the user object
    const newUser: Utilisateur = {
      nom: name,
      prenom: lastname,
      email: email,
      mdp: password,
      // You can add other fields like address, phone, etc. if necessary
    };
  
    // Call the backend API to register the user
    this.utilisateurService.createUtilisateur(newUser).subscribe({
      next: (user: Utilisateur) => {
        console.log('User registered successfully:', user);
        this.popupService.showSuccess('Registration successful');
        // Store user information in localStorage
        localStorage.setItem('user', JSON.stringify({ id: user.id, email: user.email }));
        // Navigate to the homepage or another route
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error during registration:', err);
        this.popupService.showError('Registration failed');
        // Optionally handle the error (e.g., show an error message to the user)
      }
    });
  }
  
}
