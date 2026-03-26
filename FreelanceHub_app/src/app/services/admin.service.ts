import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats, Report } from '../models/admin.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ─── Stats ─────────────────────────────────
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`);
  }

  // ─── Users ─────────────────────────────────
  getUsers(role?: string, status?: string, search?: string): Observable<any[]> {
    let params: any = {};
    if (role) params.role = role;
    if (status) params.status = status;
    if (search) params.search = search;
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { params });
  }

  updateUserStatus(userId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}/status`, { status });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }

  // ─── Freelancers ───────────────────────────
  getPendingFreelancers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/freelancers/pending`);
  }

  validateFreelancer(userId: string, action: 'approve' | 'reject'): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/freelancers/${userId}/validate`, { action });
  }

  // ─── Products ──────────────────────────────
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/products`);
  }

  updateProductStatus(productId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/products/${productId}/status`, { status });
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/products/${productId}`);
  }

  // ─── Announcements ────────────────────────
  getAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/announcements`);
  }

  deleteAnnouncement(annId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/announcements/${annId}`);
  }

  // ─── Categories ────────────────────────────
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/categories`);
  }

  createCategory(name: string, icon: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/categories`, { name, icon });
  }

  updateCategory(catId: string, name: string, icon: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/categories/${catId}`, { name, icon });
  }

  deleteCategory(catId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/categories/${catId}`);
  }

  // ─── Reports ───────────────────────────────
  getReports(status?: string): Observable<Report[]> {
    let params: any = {};
    if (status) params.status = status;
    return this.http.get<Report[]>(`${this.apiUrl}/admin/reports`, { params });
  }

  resolveReport(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/reports/${id}/resolve`, {});
  }

  ignoreReport(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/reports/${id}/ignore`, {});
  }

  deleteReport(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/reports/${id}`);
  }
}
