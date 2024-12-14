import { Component, Input, OnInit } from '@angular/core';
import { Wishlist } from '../models/Wishlist';
import { WishlistService } from '../services/Wishlist/wishlist-service.service';
import { Produit } from '../models/Produit';

@Component({
  selector: 'app-wishlist-popup',
  templateUrl: './wishlist-popup.component.html',
  styleUrls: ['./wishlist-popup.component.css'],
})
export class WishlistPopupComponent implements OnInit {
  @Input() isVisible: boolean = false;
  
  wishlists: Wishlist[] = [];

  constructor(private wishListService : WishlistService) {}

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
