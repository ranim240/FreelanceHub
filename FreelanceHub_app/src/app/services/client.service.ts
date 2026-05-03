import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Announcement } from '../models/announcement.model';
import { Message } from '../models/message.model';

export interface DashboardData {
  stats: {
    announcements: number;
    freelancers: number;
    products: number;
    messages: number;
  };
  myAnnouncements: any[];
  topFreelancers: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/client`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    // AuthService stores user under 'fh_user', the _id is used as token
    const user = this.authService.currentUser as any;
    const token = user?._id || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  getDashboardData(userId: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard/${userId}`, { headers: this.getHeaders() });
  }

  // Flask returns { announcements: [], stats: {} } — extract the array
  getAnnouncements(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/announcements/${userId}`, { headers: this.getHeaders() }).pipe(
      map((res: any) => Array.isArray(res) ? res : (res.announcements || []))
    );
  }

  // Flask returns { notifications: [], unreadCount: N } — extract the array
  getNotifications(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/notifications/${userId}`, { headers: this.getHeaders() }).pipe(
      map((res: any) => Array.isArray(res) ? res : (res.notifications || []))
    );
  }

  getFreelancers(domain?: string): Observable<any[]> {
    let url = `${this.apiUrl}/freelancers`;
    if (domain) {
      url += `?domain=${domain}`;
    }
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  postAnnouncement(userId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/announcements/${userId}`, data, { headers: this.getHeaders() });
  }

  markNotificationRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${notificationId}/read`, {}, { headers: this.getHeaders() });
  }

  deleteAnnouncement(userId: string, annId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/announcements/${userId}/${annId}`, { headers: this.getHeaders() });
  }
}
