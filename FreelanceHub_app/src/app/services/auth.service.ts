import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  // role?: 'client' | 'freelancer';
  role?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('fh_user');
    if (stored) {
      try {
        this.userSubject.next(JSON.parse(stored));
      } catch (e) {
        console.warn('AuthService: failed to parse stored user', e);
      }
    }
  }

  login(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('fh_user', JSON.stringify(user));
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('fh_user');
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map(u => !!u));
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}
