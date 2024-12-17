import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { PopupService } from 'src/app/services/popup/popup.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  ItemId: number | any;
  produit?: Produit;

  userId:number = 1

  shopContainingProduit?: Shop;
  favoriteShops: Shop[] = [];
  wishlists: Wishlist[] = [];

  commentText: string = '';
  rating: number = 5; // Default rating for new comments
  showForm: boolean = false; // Flag to control the visibility of the form

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router for navigation
    private produitService: ProduitService,
    private shopService: ShopService,
    private commService: CommentaireService,
    private utilisateurService: UtilisateurService,
    private wishlistService: WishlistService,
    private popupService: PopupService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ItemId = params.get('pid');

      // Load the product
      this.produitService.getProduitById(this.ItemId).subscribe(produit => {
        this.produit = produit;
        console.log('Produit:', this.produit);

        // If product exists, check for comments
        if (this.produit?.commentaires === undefined) {
          this.produit.commentaires = []; // Ensure it's initialized as an empty array
        }

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
    this.userId = user?.id;

    if (this.userId) {
      // Fetch the user's favorite shops when the component initializes
      this.getFavoriteShops(this.userId);
      this.getUserWishlist(this.userId);
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
        text: this.commentText,
        date: new Date().toDateString(),
        note: this.rating
      };

      this.commService.createCommentaire(commentaire, this.userId, this.ItemId) // Replace '1' with the actual user ID
        .subscribe(
          response => {
            console.log('Commentaire created:', response);
            this.popupService.showSuccess('Comment created successfully');
            this.commentText = '';
            this.rating = 5; // Reset the rating to 5 for new comments
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

  calculateAverageRating(): number {
    if (!this.produit?.commentaires || this.produit.commentaires.length === 0) {
      return 0; // Return 0 if no comments exist
    }

    const total = this.produit.commentaires.reduce((sum, com) => sum + com.note, 0);
    return Math.round((total / this.produit.commentaires.length) * 10) / 10; // Round to 1 decimal
  }

  generateStars(note: number): any[] {
    return new Array(note).fill(1); // Create an array of "1"s to represent stars
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  cancelForm(): void {
    this.showForm = false;
    this.commentText = ''; // Clear the comment text
    this.rating = 5; // Reset rating to 5
  }

  downloadImage(): void {
    if (this.produit?.fichier) {
      const link = document.createElement('a');
      link.href = this.produit.fichier;
      link.download = this.produit.name; // Set default file name
      link.click();
      this.popupService.showSuccess('Image downloaded successfully');
    } else {
      console.error('Image not available for download.');
      this.popupService.showError('Image not available for download.');
    }
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/product.jpg'; // Fallback image
  }

  async followShop(): Promise<void> {
  
    if (this.userId && this.shopContainingProduit?.id) {
      try {
        // Call addFavoriteShop API to follow the shop
        const shopid: number = this.shopContainingProduit?.id;
        await this.utilisateurService.addFavoriteShop(this.userId, shopid).toPromise();
        console.log('Shop followed successfully');
        this.popupService.showSuccess('Shop has been added to your favorites!');
        
        // Reload the favorite shops after following
        await this.getFavoriteShops(this.userId);
      } catch (error) {
        console.error('Error following shop:', error);
        this.popupService.showError('There was an error while trying to follow the shop.');
      }
    } else {
      console.warn('User is not logged in or shop ID is missing');
      alert('Please log in to follow the shop');
      this.router.navigate(['/login']);
    }
  }
  
  async unfollowShop(): Promise<void> {
  
    if (this.userId && this.shopContainingProduit?.id) {
      try {
        // Call removeFavoriteShop API to unfollow the shop
        const shopid: number = this.shopContainingProduit?.id;
        await this.utilisateurService.removeFavoriteShop(this.userId, shopid).toPromise();
        console.log('Shop unfollowed successfully');
        this.popupService.showSuccess('Shop has been removed from your favorites!');
        
        // Reload the favorite shops after unfollowing
        await this.getFavoriteShops(this.userId);
      } catch (error) {
        console.error('Error unfollowing shop:', error);
        this.popupService.showError('There was an error while trying to unfollow the shop.');
      }
    } else {
      console.warn('User is not logged in or shop ID is missing');
      this.popupService.showError('Please log in to unfollow the shop.');
      this.router.navigate(['/login']);
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
  
    if (this.userId && this.produit?.id) {
      try {
        // Call the addToWishlist API to add the product to the user's wishlist
        const productId: number = this.produit?.id;
        await this.wishlistService.addToWishlist(this.userId, productId).toPromise();
        console.log('Product added to wishlist successfully');
        this.popupService.showSuccess('Product has been added to your wishlist!');
  
        await this.getUserWishlist(this.userId);
      } catch (error) {
        console.error('Error adding product to wishlist:', error);
        this.popupService.showError('There was an error while trying to add the product to your wishlist.');
      }
    } else {
      console.warn('User is not logged in or product ID is missing');
      this.popupService.showError('Please log in to add the product to your wishlist.');
    }
  }

  async removeFromWishlist(): Promise<void> {
  
    if (this.userId && this.produit?.id) {
      try {
        // Assuming you have the wishlistId, you can call removeFromWishlist
        const wishlist = this.wishlists.find(w => w.produit.id === this.produit?.id);
        if (wishlist) {
          const wishlistId = wishlist.id;
          await this.wishlistService.removeFromWishlist(wishlistId).toPromise();
          console.log('Product removed from wishlist successfully');
          this.popupService.showSuccess('Product has been removed from your wishlist!');
  
          await this.getUserWishlist(this.userId);
        } else {
          this.popupService.showError('Product not found in your wishlist.');
        }
      } catch (error) {
        console.error('Error removing product from wishlist:', error);
        this.popupService.showError('There was an error while trying to remove the product from your wishlist.');
      }
    } else {
      console.warn('User is not logged in or product ID is missing');
      this.popupService.showError('Please log in to remove the product from your wishlist.');
      this.router.navigate(['/login']);
    }
  }
  

}
