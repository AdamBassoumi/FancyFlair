import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../services/Produit/produit.service';
import { Produit } from '../models/Produit';
import { UtilisateurService } from '../services/Utilisateur/utilisateur.service';
import { Utilisateur } from '../models/Utilisateur';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  utilisateur?: Utilisateur;

  minPrice: number = 0;
  maxPrice: number = 1000;

  constructor(
    private produitService: ProduitService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUtilisateur();
  }


  loadUtilisateur(): void {
    // Assuming user information is available in localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      this.utilisateurService.getUtilisateurById(user.id).subscribe(
        utilisateur => {
          this.utilisateur = utilisateur;
          console.log('Utilisateur:', this.utilisateur); // Logging utilisateur

          // Handle shop localStorage
          if (this.utilisateur?.shop) {
            localStorage.setItem('shop', this.utilisateur.shop.id.toString());
          } else {
            localStorage.removeItem('shop');
          }
        },
        error => {
          console.error('Error loading utilisateur', error);
        }
      );
    } else {
      localStorage.removeItem('shop'); // Remove shop key if no user
    }
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  hasShop(): boolean {
    return this.utilisateur?.shop !== undefined && this.utilisateur.shop !== null;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('shop'); // Clear shop key on logout
    console.log('User logged out');
    this.router.navigate(['/']);
  }
}
