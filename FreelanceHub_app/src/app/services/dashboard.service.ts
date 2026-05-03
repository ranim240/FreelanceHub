import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientService } from './client.service';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { ClientPost } from '../models/client-post.model';
import { Message } from '../models/message.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private clientService: ClientService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  getPosts(userId: string): Observable<ClientPost[]> {
    return this.clientService.getAnnouncements(userId);
  }

  getMessages(userId: string): Observable<Message[]> {
    // Map to Message model if needed, or use notifications
    return this.clientService.getNotifications(userId);
  }

  getCart(userId: string): Observable<CartItem[]> {
    return this.cartService.getCart(userId);
  }

  publishProject(userId: string, project: any): Observable<any> {
    return this.clientService.postAnnouncement(userId, project);
  }
}

