import { Pipe, PipeTransform } from '@angular/core';
import { Produit } from '../models/Produit';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {
  transform(produits: Produit[], selectedCategories: number[]): Produit[] {
    if (!produits || !selectedCategories || selectedCategories.length === 0) {
      return produits;
    }
    return produits.filter(produit => selectedCategories.includes(produit.category.id));
  }
}