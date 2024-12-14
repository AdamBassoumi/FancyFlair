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
import { Wishlist } from 'src/app/models/Wishlist';
import { WishlistService } from 'src/app/services/Wishlist/wishlist-service.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  ItemId: number | any;
  produit?: Produit;

  shopContainingProduit?: Shop;
  favoriteShops: Shop[] = [];
  wishlists: Wishlist[] = [];

  commentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private shopService: ShopService,
    private commService: CommentaireService,
    private utilisateurService: UtilisateurService,
    private wishlistService: WishlistService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ItemId = params.get('pid');

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

    // Get user ID from local storage
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;

    if (userId) {
      // Fetch the user's favorite shops when the component initializes
      this.getFavoriteShops(userId);
      this.getUserWishlist(userId);
    } else {
      console.warn('User not logged in');
    }
  }

  getFavoriteShops(userId: number): void {
    this.utilisateurService.getFavoriteShops(userId).subscribe(
      (shops: Shop[]) => {
        this.favoriteShops = shops;
        console.log('Favorite shops:', this.favoriteShops);
      },
      (error) => {
        console.error('Error fetching favorite shops:', error);
      }
    );
  }

  getUserWishlist(userId: number): void {
    this.wishlistService.getUserWishlist(userId).subscribe(
      (wishlists: Wishlist[]) => {
        this.wishlists = wishlists;
        console.log('User wishlists:', this.wishlists);
      },
      (error) => {
        console.error('Error fetching user wishlists:', error);
      }
    );
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

  async followShop(): Promise<void> {
    // Get the user ID from local storage
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
  
    if (userId && this.shopContainingProduit?.id) {
      try {
        // Call addFavoriteShop API to follow the shop
        const shopid: number = this.shopContainingProduit?.id;
        await this.utilisateurService.addFavoriteShop(userId, shopid).toPromise();
        console.log('Shop followed successfully');
        alert('Shop has been added to your favorites!');
        
        // Reload the favorite shops after following
        await this.getFavoriteShops(userId);
      } catch (error) {
        console.error('Error following shop:', error);
        alert('There was an error while trying to follow the shop.');
      }
    } else {
      console.warn('User is not logged in or shop ID is missing');
      alert('Please log in to follow the shop');
    }
  }
  
  async unfollowShop(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
  
    if (userId && this.shopContainingProduit?.id) {
      try {
        // Call removeFavoriteShop API to unfollow the shop
        const shopid: number = this.shopContainingProduit?.id;
        await this.utilisateurService.removeFavoriteShop(userId, shopid).toPromise();
        console.log('Shop unfollowed successfully');
        alert('Shop has been removed from your favorites!');
        
        // Reload the favorite shops after unfollowing
        await this.getFavoriteShops(userId);
      } catch (error) {
        console.error('Error unfollowing shop:', error);
        alert('There was an error while trying to unfollow the shop.');
      }
    } else {
      console.warn('User is not logged in or shop ID is missing');
      alert('Please log in to unfollow the shop');
    }
  }

  isShopInFavorites(): boolean {
    // Return true if the shop is in the favoriteShops array, otherwise false
    return this.favoriteShops.some(favoriteShop => favoriteShop.id === this.shopContainingProduit?.id);
  }

  checkIfProductInWishlist(): boolean {

    // Check if the product is already in the wishlist using the wishlists array
    return this.wishlists.some(wishlist => wishlist.produit.id === this.produit?.id);
  }

  async addToWishlist(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
  
    if (userId && this.produit?.id) {
      try {
        // Call the addToWishlist API to add the product to the user's wishlist
        const productId: number = this.produit?.id;
        await this.wishlistService.addToWishlist(userId, productId).toPromise();
        console.log('Product added to wishlist successfully');
        alert('Product has been added to your wishlist!');
  
        await this.getUserWishlist(userId);
      } catch (error) {
        console.error('Error adding product to wishlist:', error);
        alert('There was an error while trying to add the product to your wishlist.');
      }
    } else {
      console.warn('User is not logged in or product ID is missing');
      alert('Please log in to add the product to your wishlist');
    }
  }

  async removeFromWishlist(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
  
    if (userId && this.produit?.id) {
      try {
        // Assuming you have the wishlistId, you can call removeFromWishlist
        const wishlist = this.wishlists.find(w => w.produit.id === this.produit?.id);
        if (wishlist) {
          const wishlistId = wishlist.id;
          await this.wishlistService.removeFromWishlist(wishlistId).toPromise();
          console.log('Product removed from wishlist successfully');
          alert('Product has been removed from your wishlist!');
  
          await this.getUserWishlist(userId);
        } else {
          alert('Product not found in your wishlist');
        }
      } catch (error) {
        console.error('Error removing product from wishlist:', error);
        alert('There was an error while trying to remove the product from your wishlist.');
      }
    } else {
      console.warn('User is not logged in or product ID is missing');
      alert('Please log in to remove the product from your wishlist');
    }
  }
  

}
