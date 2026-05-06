import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Conversation {
  _id:          string;
  name:         string;
  initials:     string;
  avatarColor:  string;
  lastMessage:  string;
  time:         string;
  unread:       number;
  online:       boolean;
  freelancerId: string;
}

export interface Message {
  _id?:      string;
  text:      string;
  mine:      boolean;
  time:      string;
  senderId?: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {

  private base = `${environment.apiUrl}/client`;

  constructor(private http: HttpClient) {}

  /** GET /api/client/messages — liste de toutes les conversations */
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.base}/messages`);
  }

  /** GET /api/client/messages/:id — messages d'une conversation */
  getMessages(conversationId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/messages/${conversationId}`);
  }

  /** POST /api/client/messages/start — démarrer une conversation avec un freelancer */
  startConversation(freelancerId: string): Observable<{ conversationId: string }> {
    return this.http.post<{ conversationId: string }>(`${this.base}/messages/start`, { freelancerId });
  }

  /** POST /api/client/messages/:id — envoyer un message (fallback REST, socket est préféré) */
  sendMessage(conversationId: string, text: string): Observable<Message> {
    return this.http.post<Message>(`${this.base}/messages/${conversationId}`, { text });
  }

  /** PUT /api/client/messages/:id/read — marquer comme lu */
  markAsRead(conversationId: string): Observable<any> {
    return this.http.put(`${this.base}/messages/${conversationId}/read`, {});
  }

  /** GET /api/client/messages/unread-count */
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.base}/messages/unread-count`);
  }
}