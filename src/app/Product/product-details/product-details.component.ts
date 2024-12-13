import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from '../../services/Produit/produit.service';
import { Produit } from '../../models/Produit';
import { ShopService } from '../../services/Shop/shop.service';
import { Shop } from '../../models/Shop';
import { forkJoin } from 'rxjs';
import { CommentaireService } from '../../services/Commentaire/commentaire.service';
import { Commentaire } from '../../models/Commentaire';
import { UtilisateurService } from 'src/app/services/Utilisateur/utilisateur.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  ItemId: number | any;
  produit?: Produit;
  shops?: Shop[];
  shopContainingProduit?: Shop;

  commentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private shopService: ShopService,
    private commService : CommentaireService,
    private utilisateurService: UtilisateurService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ItemId = params.get('pid'); // Get the parameter
      console.log(this.ItemId);
  
      // Load the product
      this.produitService.getProduitById(this.ItemId).subscribe(produit => {
        this.produit = produit;
        console.log('Produit:', this.produit);
  
        if (this.produit?.shop?.id) {
          // Fetch the shop using the shop ID from the product
          this.shopService.getShopById(this.produit.shop.id).subscribe(shop => {
            this.shopContainingProduit = shop;
            console.log('Shop containing product:', this.shopContainingProduit);
          });
        } else {
          console.warn('The product does not have an associated shop ID.');
        }
      });
    });
  }

  onSubmit(): void {
    if (this.commentText.trim()) {
      const commentaire: any = {
        uname: 'User Name', // Replace with the actual user name
        text: this.commentText,
        date: new Date().toDateString(),
        note: 5 
      };
      this.commService.createCommentaire(commentaire, 1, this.ItemId) // Replace '1' with the actual user ID
        .subscribe(
          response => {
            console.log('Commentaire created:', response);
            this.commentText = '';
            this.produitService.getProduitById(this.ItemId).subscribe(
              (produit: Produit) => {
                this.produit = produit;
                console.log(produit);
                //this.findShopContainingProduit(); // Re-find the shop containing the updated product
              }
            );
          },
          error => {
            console.error('Error creating commentaire:', error);
          }
        );
    }
  }

  downloadImage(): void {
    if (this.produit?.fichier) {
      const link = document.createElement('a');
      link.href = this.produit.fichier;
      link.download = 'product-image'; // Set default file name
      link.click();
    } else {
      console.error('Image not available for download.');
    }
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/product.jpg'; // Fallback image
}

followShop(): void {
  // Get the user ID from local storage
  const user = JSON.parse(localStorage.getItem('user')!);
  const userId = user?.id;

  if (userId && this.shopContainingProduit?.id) {
    // Call addFavoriteShop API to follow the shop
    const shopid : number  = this.shopContainingProduit?.id;
    this.utilisateurService.addFavoriteShop(userId, shopid).subscribe(
      (response) => {
        console.log('Shop followed successfully:', response);
        alert('Shop has been added to your favorites!');
      },
      (error) => {
        console.error('Error following shop:', error);
        alert('There was an error while trying to follow the shop.');
      }
    );
  } else {
    console.warn('User is not logged in or shop ID is missing');
    alert('Please log in to follow the shop');
  }
}


}
