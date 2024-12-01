import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/models/Shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:9090/api/shops'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl);
  }

  getShopById(id: number): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/${id}`);
  }

  createShop(shop: Shop, id: number): Observable<Shop> {
    // Assuming your backend expects id as part of the URL or body
    return this.http.post<Shop>(`${this.apiUrl}/${id}`, shop);
  }

  /*
  // Uncomment this method if you want to implement update functionality
  updateShop(id: number, shop: Shop): Observable<Shop> {
    return this.http.put<Shop>(`${this.apiUrl}/${id}`, shop);
  }
  */

  deleteShop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}