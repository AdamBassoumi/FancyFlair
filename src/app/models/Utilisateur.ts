import { Shop } from "./Shop";
import { Wishlist } from "./Wishlist";

export interface Utilisateur {
    id?: number;
    nom: string;
    prenom?: string;
    email: string;
    mdp: string;
    shop?: Shop;
    favoriteShops?: Shop[];
    wishlistItems?: Wishlist[];
}
