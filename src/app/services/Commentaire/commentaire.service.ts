import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commentaire } from 'src/app/models/Commentaire';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private apiUrl = 'http://localhost:9090/api/commentaires'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getAllCommentaires(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(this.apiUrl);
  }

  getCommentaireById(id: number): Observable<Commentaire> {
    return this.http.get<Commentaire>(`${this.apiUrl}/${id}`);
  }

  createCommentaire(commentaire: Commentaire, Uid: number, Pid: number): Observable<Commentaire> {
    const url = `${this.apiUrl}/${Uid}/${Pid}`;
    return this.http.post<Commentaire>(url, commentaire);
  }

  updateCommentaire(id: number, commentaire: Commentaire): Observable<Commentaire> {
    return this.http.put<Commentaire>(`${this.apiUrl}/${id}`, commentaire);
  }

  deleteCommentaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
