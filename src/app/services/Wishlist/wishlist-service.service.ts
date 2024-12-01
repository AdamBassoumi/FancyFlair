import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wishlist } from 'src/app/models/Wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:9090/api/wishlist'; 

  constructor(private http: HttpClient) {}


  getUserWishlist(userId: number): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.apiUrl}/${userId}`);
  }


  addToWishlist(userId: number, productId: number): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.apiUrl}/${userId}/${productId}`, {});
  }

  removeFromWishlist(wishlistId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${wishlistId}`);
  }
}
