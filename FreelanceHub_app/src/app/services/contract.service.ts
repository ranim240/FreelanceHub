import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `${environment.apiUrl}/contracts`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const user = this.authService.currentUser as any;
    const token = user?._id || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // ── Create ─────────────────────────────────────────
  createContract(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // ── Get contracts ──────────────────────────────────
  getClientContracts(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client/${userId}`);
  }

  getFreelancerContracts(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/freelancer/${userId}`);
  }

  getContract(contractId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${contractId}`);
  }

  // ── Pay (Stripe) ───────────────────────────────────
  payContract(contractId: string): Observable<{ id: string; url: string }> {
    return this.http.post<{ id: string; url: string }>(`${this.apiUrl}/${contractId}/pay`, {});
  }

  fundContract(contractId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${contractId}/fund`, {});
  }

  // ── Freelancer actions ─────────────────────────────
  updateTasks(contractId: string, tasks: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${contractId}/tasks`, { tasks });
  }

  updateMilestones(contractId: string, milestones: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${contractId}/milestones`, { milestones });
  }

  deliverContract(contractId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${contractId}/deliver`, {});
  }

  // ── Client action ──────────────────────────────────
  validateContract(contractId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${contractId}/validate`, {});
  }

  // ── Admin ──────────────────────────────────────────
  getAllContracts(status?: string): Observable<any[]> {
    const url = status ? `${this.apiUrl}/admin/all?status=${status}` : `${this.apiUrl}/admin/all`;
    return this.http.get<any[]>(url);
  }

  getEscrowStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }

  // ── Freelancers list (for contract creation) ───────
  getFreelancersList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/freelancers`);
  }
}