import { Produit } from "./Produit";
import { Utilisateur } from "./Utilisateur";

export interface Shop {
    id: number;
    name: string;
    description: string;
    dateCreation: string;
    utilisateur: Utilisateur;
    produits: Produit[];
}
