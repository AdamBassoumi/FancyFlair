import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Wishlist } from '../models/Wishlist';
import { UtilisateurService } from '../services/Utilisateur/utilisateur.service';
import { WishlistService } from '../services/Wishlist/wishlist-service.service';

@Component({
  selector: 'app-wishlist-popup',
  templateUrl: './wishlist-popup.component.html',
  styleUrls: ['./wishlist-popup.component.css'],
})
export class WishlistPopupComponent implements OnInit {
  @Input() isVisible: boolean = false;
  
  wishlistItems: Wishlist[] = []; // This will hold the wishlist items fetched from the API

  constructor(private wishListService : WishlistService) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.loadWishlist(userId);
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

  // Method to fetch wishlist from the API
  loadWishlist(userId: number): void {
    this.wishListService.getUserWishlist(userId).subscribe(
      (wishlist: Wishlist[]) => {
        this.wishlistItems = wishlist;
      },
      (error) => {
        console.error('Error fetching wishlist:', error);
      }
    );
  }

  // Method to close the popup
  closePopup() {
    this.isVisible = false;
  }

  // Method to remove an item from the wishlist
  removeFromWishlist(id: number) {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
  }
}
