import { Component } from '@angular/core';
import { Utilisateur } from '../models/Utilisateur';
import { UtilisateurService } from '../services/Utilisateur/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  utilisateurs?: Utilisateur[];

  constructor(private utilisateurService: UtilisateurService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.utilisateurService.getAllUtilisateurs().subscribe(
      utilisateurs => {
        this.utilisateurs = utilisateurs;
        console.log('Utilisateurs:', this.utilisateurs);
      },
      error => {
        console.error('Error loading utilisateurs', error);
      }
    );
  }

  onSubmit(): void {
    const emailOrUsername = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const user = this.utilisateurs?.find(u => 
      (u.email === emailOrUsername || u.nom === emailOrUsername) && u.mdp === password
    );

    if (user) {
      console.log('User found:', user);
      localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.nom }));
      this.router.navigate(['/']);
    } else {
      console.log('Invalid credentials');
    }
  }
}
