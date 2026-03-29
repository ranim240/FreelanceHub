import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientPost } from '../models/client-post.model';
import { Message } from '../models/message.model';
import { CartItem } from '../models/cart-item.model';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private postsSubject = new BehaviorSubject<ClientPost[]>([
    { id: '1', title: 'E-commerce Mobile App', description: 'Développement app mobile...', budget: '1500 DT', proposals: 5 },
    { id: '2', title: 'Design Logo', description: 'Création logo moderne...', budget: '300 DT', proposals: 12 },
  ]);
  posts$: Observable<ClientPost[]> = this.postsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>([
    { id: '1', interlocutor: 'Freelancer Ahmed', lastMessage: "J'ai vu votre projet...", time: 'il y a 5 min' },
    { id: '2', interlocutor: 'Dev Sara', lastMessage: 'Proposition envoyée !', time: 'hier' },
  ]);
  messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  private cartSubject = new BehaviorSubject<CartItem[]>([
    { id: '1', image: 'assets/images/products/e-commerceKit.png', name: 'E-commerce Kit', price: '250 DT' },
    { id: '2', image: 'assets/images/products/Mobile_UI_Kit.png', name: 'Mobile UI Kit', price: '150 DT' },
  ]);
  cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  getPosts(): Observable<ClientPost[]> { return this.posts$; }
  getMessages(): Observable<Message[]> { return this.messages$; }
  getCart(): Observable<CartItem[]> { return this.cart$; }

  publishProject(project: Project) {
    const newPost: ClientPost = {
      id: Date.now().toString(),
      title: project.title,
      description: project.description,
      budget: project.budget + ' DT',
      proposals: 0
    };
    const current = this.postsSubject.value;
    this.postsSubject.next([newPost, ...current]);
  }

  constructor() {}
}

