import { Utilisateur } from './Utilisateur';
import { Produit } from './Produit';

export interface Wishlist {
  id: number;
  utilisateur: Utilisateur;
  produit: Produit;
  dateAdded: string;
}
