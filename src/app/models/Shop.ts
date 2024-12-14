import { Produit } from "./Produit";
import { Utilisateur } from "./Utilisateur";

export interface Shop {
    id: number;
    nom: string;
    description: string;
    dateCreation: string;
    utilisateur: Utilisateur;
    produits: Produit[];
}
