import { Pipe, PipeTransform } from '@angular/core';
import { Produit } from '../models/Produit';

@Pipe({
  name: 'priceRangeFilter'
})
export class PriceRangeFilterPipe implements PipeTransform {
  transform(produits: Produit[], minPrice: number, maxPrice: number): Produit[] {
    if (!produits) {
      return produits;
    }

    return produits.filter(produit => produit.prix >= minPrice && produit.prix <= maxPrice);
  }
}
