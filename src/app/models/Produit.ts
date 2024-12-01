import { Category } from "./Category";
import { Commentaire } from "./Commentaire";

export interface Produit {
    id: number;
    name: string;
    description: string;
    prix: number;
    fichier: string; // Path to an image file
    dateCreation: string; // Use string for ISO date format
    stock: number;
    category: Category;
    commentaires: Commentaire[];
}
