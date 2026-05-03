import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const user = this.authService.currentUser as any;
    const token = user?._id || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  getCart(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: string, productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}`, { productId });
  }

  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/${productId}`);
  }

  checkout(userId: string): Observable<{ id: string, url: string }> {
    return this.http.post<{ id: string, url: string }>(`${this.apiUrl}/${userId}/checkout`, {});
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/clear`);
  }
}