import { Component, Input, OnInit } from '@angular/core';
import { Wishlist } from '../models/Wishlist';
import { WishlistService } from '../services/Wishlist/wishlist-service.service';
import { Produit } from '../models/Produit';
import { PopupService } from '../services/popup/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist-popup',
  templateUrl: './wishlist-popup.component.html',
  styleUrls: ['./wishlist-popup.component.css'],
})
export class WishlistPopupComponent implements OnInit {
  @Input() isVisible: boolean = false;
  
  wishlists: Wishlist[] = [];

  constructor(private wishListService : WishlistService,
              private popupService: PopupService,
              private router : Router,
  ) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.getUserWishlist(userId);
    }
  }

  // Method to fetch the user ID from localStorage
  getUserIdFromLocalStorage(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.id;
    }
    return null;
  }

  getUserWishlist(userId: number): void {
    this.wishListService.getUserWishlist(userId).subscribe(
      (wishlists: Wishlist[]) => {
        this.wishlists = wishlists;
        console.log('User wishlists:', this.wishlists);
      },
      (error) => {
        console.error('Error fetching user wishlists:', error);
      }
    );
  }

  // Method to close the popup
  closePopup() {
    this.isVisible = false;
  }

  async removeWishlist(produit: Produit): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
  
    if (userId && produit?.id) {
      try {
        // Assuming you have the wishlistId, you can call removeFromWishlist
        const wishlist = this.wishlists.find(w => w.produit.id === produit?.id);
        if (wishlist) {
          const wishlistId = wishlist.id;
          await this.wishListService.removeFromWishlist(wishlistId).toPromise();
          this.popupService.showSuccess('Product has been removed from your wishlist!');
  
          await this.getUserWishlist(userId);
        } else {
          this.popupService.showError('Product not found in your wishlist.');
        }
      } catch (error) {
        this.popupService.showError('There was an error while trying to remove the product from your wishlist.');
      }
    } else {
      this.popupService.showError('Please log in to remove the product from your wishlist.');
      this.router.navigate(['/login']);
    }
  }
}
