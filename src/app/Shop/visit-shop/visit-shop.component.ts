import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Shop } from 'src/app/models/Shop';
import { Wishlist } from 'src/app/models/Wishlist';
import { CategoryService } from 'src/app/services/Category/category.service';
import { PopupService } from 'src/app/services/popup/popup.service';
import { ShopService } from 'src/app/services/Shop/shop.service';
import { UtilisateurService } from 'src/app/services/Utilisateur/utilisateur.service';
import { WishlistService } from 'src/app/services/Wishlist/wishlist-service.service';

@Component({
  selector: 'app-visit-shop',
  templateUrl: './visit-shop.component.html',
  styleUrls: ['./visit-shop.component.css']
})
export class VisitShopComponent implements OnInit {
  
  categories?: Category[];
  selectedCategoryIds: number[] = [];
  selectedSortingOption: string = '';
  shopId?: number;
  shop?: Shop;
  utilisateur: any; // To hold the user data
  user:any;

    favoriteShops: Shop[] = [];
    wishlists: Wishlist[] = [];

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService, // Inject the utilisateur service
    private wishlistService: WishlistService,
    private router: Router,
    private popupService: PopupService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadShop()
        // Get user ID from local storage
        this.user = JSON.parse(localStorage.getItem('user')!);
        if (this.user.id) {
          // Fetch the user's favorite shops when the component initializes
          this.getFavoriteShops(this.user.id);
          this.getUserWishlist(this.user.id);
          this.loadUtilisateur(); // Load utilisateur data first
        } else {
          console.warn('User not logged in');
        }
    this.loadShop()
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

  loadShop():void{
    this.route.paramMap.subscribe(params => {
      this.shopId = +params.get('sid')!; // Retrieve and convert the shop ID from the URL
      
      if (this.shopId) {

          // Fetch the shop details if it doesn't match
          this.shopService.getShopById(this.shopId).subscribe(
            (shop) => {
              this.shop = shop; // Store the shop details
              console.log('Shop Details:', this.shop);
            },
            (error) => {
              console.error('Error loading shop details', error);
            }
          );
        
      } else {
        console.warn('No shop ID found in route');
      }
    });
  }

  loadUtilisateur(): void {

      this.utilisateurService.getUtilisateurById(this.user.id).subscribe(
        utilisateur => {
          this.utilisateur = utilisateur;
          console.log('Utilisateur:', this.utilisateur); // Logging utilisateur
          if (this.utilisateur?.shop?.id === this.shopId) {
            // If it matches, redirect to /MyShop
            this.router.navigate(['/MyShop']);
          }
        },
        error => {
          console.error('Error loading utilisateur', error);
        }
      );
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        console.log('Categories:', this.categories); // Logging categories
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }

  handleCheckboxChange(categoryId: number): void {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index === -1) {
      // Add to selectedCategoryIds if not already selected
      this.selectedCategoryIds.push(categoryId);
    } else {
      // Remove from selectedCategoryIds if already selected
      this.selectedCategoryIds.splice(index, 1);
    }
    console.log('Selected Category IDs:', this.selectedCategoryIds);
  }

  handleSortingChange(event: any): void {
    this.selectedSortingOption = (event.target as HTMLSelectElement).value;
    console.log('Selected Sorting Option:', this.selectedSortingOption);
    // Perform sorting logic or update data based on the selected option
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/bullet.png'; // Fallback image
  }

  async followShop(): Promise<void> {
  
    if (this.user.id && this.shop?.id) {
      try {
        // Call addFavoriteShop API to follow the shop
        const shopid: number = this.shop?.id;
        await this.utilisateurService.addFavoriteShop(this.user.id, shopid).toPromise();
        this.popupService.showSuccess('Shop followed successfully');
        
        // Reload the favorite shops after following
        await this.getFavoriteShops(this.user.id);
      } catch (error) {
        this.popupService.showError('There was an error while trying to follow the shop.');
      }
    } else {
      this.popupService.showError('Please log in to follow the shop');
      this.router.navigate(['/login']);
    }
  }
  
  async unfollowShop(): Promise<void> {
  
    if (this.user.id && this.shop?.id) {
      try {
        // Call removeFavoriteShop API to unfollow the shop
        const shopid: number = this.shop?.id;
        await this.utilisateurService.removeFavoriteShop(this.user.id, shopid).toPromise();
        this.popupService.showSuccess('Shop unfollowed successfully');
        
        // Reload the favorite shops after unfollowing
        await this.getFavoriteShops(this.user.id);
      } catch (error) {
        this.popupService.showError('There was an error while trying to unfollow the shop.');
      }
    } else {
      this.popupService.showError('Please log in to unfollow the shop');
      this.router.navigate(['/login']);

    }
  }

  isShopInFavorites(): boolean {
    // Return true if the shop is in the favoriteShops array, otherwise false
    return this.favoriteShops.some(favoriteShop => favoriteShop.id === this.shop?.id);
  }

  checkIfProductInWishlist(produitId: number): boolean {

    // Check if the product is already in the wishlist using the wishlists array
    return this.wishlists.some(wishlist => wishlist.produit.id === produitId);
  }

  async addToWishlist(produitId : number): Promise<void> {
  
    if (this.user.id && produitId) {
      try {
        // Call the addToWishlist API to add the product to the user's wishlist
        const productId: number = produitId
        await this.wishlistService.addToWishlist(this.user.id, productId).toPromise();
        this.popupService.showSuccess('Product has been added to your wishlist!');
  
        await this.getUserWishlist(this.user.id);
      } catch (error) {
        console.error('Error adding product to wishlist:', error);
        this.popupService.showError('There was an error while trying to add the product to your wishlist.');
      }
    } else {
      console.warn('User is not logged in or product ID is missing');
      this.popupService.showError('Please log in to add the product to your wishlist.');
      this.router.navigate(['/login']);
    }
  }

  async removeFromWishlist(produitId : number): Promise<void> {
  
    if (this.user.id && produitId) {
      try {
        // Assuming you have the wishlistId, you can call removeFromWishlist
        const wishlist = this.wishlists.find(w => w.produit.id === produitId);
        if (wishlist) {
          const wishlistId = wishlist.id;
          await this.wishlistService.removeFromWishlist(wishlistId).toPromise();
          this.popupService.showSuccess('Product has been removed from your wishlist!');
  
          await this.getUserWishlist(this.user.id);
        } else {
          this.popupService.showError('Product not found in your wishlist.');
        }
      } catch (error) {
        console.error('Error removing product from wishlist:', error);
        this.popupService.showError('There was an error while trying to remove the product from your wishlist.');
      }
    } else {
      this.popupService.showError('Please log in to remove the product from your wishlist.');
      this.router.navigate(['/login']);
    }
  }
}
