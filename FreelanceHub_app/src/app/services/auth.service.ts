import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from './socket.service';  // ← import manquant

export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private socketService: SocketService) {
    const stored = localStorage.getItem('fh_user');
    const token  = localStorage.getItem('token');
    if (stored && token) {
      try {
        this.userSubject.next(JSON.parse(stored));
        this.socketService.connect();
      } catch (e) {
        console.warn('AuthService: failed to parse stored user', e);
      }
    }
  }

  login(user: User, token: string) {
    this.userSubject.next(user);
    localStorage.setItem('fh_user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.socketService.connect();
  }

  logout() {
    this.socketService.disconnect();
    this.userSubject.next(null);
    localStorage.removeItem('fh_user');
    localStorage.removeItem('token');
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map(u => !!u));
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}