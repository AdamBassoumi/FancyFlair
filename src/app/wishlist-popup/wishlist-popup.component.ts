import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wishlist-popup',
  templateUrl: './wishlist-popup.component.html',
  styleUrls: ['./wishlist-popup.component.css'],
})
export class WishlistPopupComponent {
  @Input() isVisible: boolean = false;

  // Static wishlist items
  wishlistItems = [
    { id: 1, productName: 'Item 1', productDescription: 'Description for Item 1' },
    { id: 2, productName: 'Item 2', productDescription: 'Description for Item 2' },
    { id: 3, productName: 'Item 3', productDescription: 'Description for Item 3' },
  ];

  closePopup() {
    this.isVisible = false;
  }

  removeFromWishlist(id: number) {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
  }
}
