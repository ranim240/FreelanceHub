import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) { }

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
