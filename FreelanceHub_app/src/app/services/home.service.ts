import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { Category } from '../models/category.model';
import { Faq } from '../models/faq.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAnnouncements(): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`);
    }

    getFaqs(): Observable<Faq[]> {
        return this.http.get<Faq[]>(`${this.apiUrl}/faqs`);
    }
}
