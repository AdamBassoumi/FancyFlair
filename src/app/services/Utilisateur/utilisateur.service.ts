import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/models/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:9090/api/utilisateurs'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getUtilisateurById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  createUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }

  updateUtilisateur(id: number, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Add a shop to the user's favorites
  addFavoriteShop(userId: number, shopId: number): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/${userId}/favorites/${shopId}`, {});
  }

  // Remove a shop from the user's favorites
  removeFavoriteShop(userId: number, shopId: number): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(`${this.apiUrl}/${userId}/favorites/${shopId}`);
  }

  // Validate user credentials
  validateUserCredentials(email: string, mdp: string): Observable<Utilisateur> {
    const credentials = { email, mdp };
    return this.http.post<Utilisateur>(`${this.apiUrl}/validate`, credentials);
  }
}
