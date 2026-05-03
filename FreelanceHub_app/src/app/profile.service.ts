import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  domain?: string;
  linkedin?: string;
  portfolio?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:5000/api';  // Backend Flask
  private currentProfileSubject = new BehaviorSubject<any>(null);
  public currentProfile$ = this.currentProfileSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();  // Assume auth has getToken()
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ── API Calls ──────────────────────────────────────
  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${userId}`).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
        console.log('Profile loaded:', profile);
      }),
      catchError(err => {
        console.warn('API profile failed, fallback local:', err);
        return of(null);  // Fallback null
      })
    );
  }

  updateProfile(userId: string, data: Partial<ProfileData>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/${userId}`, data, { headers: this.getAuthHeaders() })
      .pipe(
        tap(updated => {
          this.currentProfileSubject.next(updated);
          console.log('Profile updated:', updated);
        }),
        catchError(err => {
          console.error('Profile update error:', err);
          throw err;
        })
      );
  }

  // ── Local cache (legacy + fallback) ─────────────────
  private personal: ProfileData = {
    firstName: '', lastName: '', email: '', phone: '', gender: '',
    location: '', bio: '', avatarUrl: '', domain: '', linkedin: '', portfolio: ''
  };

  private education = { degree: '', year: '', school: '', department: '', description: '' };
  private work = { jobTitle: '', company: '', fromDate: '', toDate: '', description: '' };

  setPersonal(data: any) { this.personal = { ...this.personal, ...data }; }
  getPersonal() { return { ...this.personal }; }
  setEducation(data: any) { this.education = { ...this.education, ...data }; }
  getEducation() { return this.education; }
  setWork(data: any) { this.work = { ...this.work, ...data }; }
  getWork() { return this.work; }

  isPersonalComplete(): boolean {
    return !!(this.personal.firstName && this.personal.lastName && this.personal.email);
  }
  isEducationComplete(): boolean {
    return !!(this.education.degree && this.education.year && this.education.school);
  }
  isWorkComplete(): boolean {
    return !!(this.work.jobTitle && this.work.company && this.work.fromDate);
  }

  getCompletionPercent(): number {
    let pct = 0;
    if (this.isPersonalComplete()) pct += 34;
    if (this.isEducationComplete()) pct += 33;
    if (this.isWorkComplete()) pct += 33;
    return pct;
  }

  clearAll() {
    this.personal = { firstName: '', lastName: '', email: '', phone: '', gender: '', location: '', bio: '', avatarUrl: '', domain: '', linkedin: '', portfolio: '' };
    this.education = { degree: '', year: '', school: '', department: '', description: '' };
    this.work = { jobTitle: '', company: '', fromDate: '', toDate: '', description: '' };
    this.currentProfileSubject.next(null);
  }
}
