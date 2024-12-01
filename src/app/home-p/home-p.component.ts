import { Component } from '@angular/core';
import { ProduitService } from '../services/Produit/produit.service';
import { Produit } from '../models/Produit';

@Component({
  selector: 'app-home-p',
  templateUrl: './home-p.component.html',
  styleUrls: ['./home-p.component.css']
})
export class HomePComponent {


  produits: Produit[] = [];

  minPrice: number = 0;
  maxPrice: number = 1000;

  constructor(
    private produitService: ProduitService,
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe(
      produits => {
        this.produits = produits;
        console.log('Produits:', this.produits); // Logging produits
      },
      error => {
        console.error('Error loading produits', error);
      }
    );
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/product.jpg'; // Fallback image
}

}
