import { Pipe, PipeTransform } from '@angular/core';
import { Produit } from '../models/Produit';

@Pipe({
  name: 'sortingFilter'
})
export class SortingFilterPipe implements PipeTransform {
  transform(produits: Produit[], selectedSorting: string): Produit[] {
    if (!produits || !selectedSorting) {
      return produits;
    }

    switch (selectedSorting) {
      case 'price-low-to-high':
        return produits.sort((a, b) => a.prix - b.prix);
      case 'price-high-to-low':
        return produits.sort((a, b) => b.prix - a.prix);
      case 'latest':
        return produits.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
      default:
        return produits;
    }
  }
}
