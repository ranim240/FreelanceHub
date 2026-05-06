import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

export interface SocketMessage {
  _id?:     string;
  text:     string;
  mine:     boolean;
  time:     string;
  senderId?: string;
}

export interface TypingEvent {
  conversationId: string;
  isTyping:       boolean;
}

export interface Notification {
  type:        string;
  title:       string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private readonly SERVER = 'http://localhost:5000';

  // Observables your components subscribe to
  newMessage$    = new Subject<SocketMessage>();
  userTyping$    = new Subject<TypingEvent>();
  notification$  = new Subject<Notification>();

  // ─── Connection ─────────────────────────────────────────────────────────────

  connect(): void {
    const token = localStorage.getItem('token');
    if (!token || this.socket?.connected) return;

    this.socket = io(this.SERVER, {
      query:             { token },
      transports:        ['websocket'],
      reconnection:      true,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () =>
      console.log('[Socket] connected:', this.socket?.id)
    );

    this.socket.on('disconnect', () =>
      console.log('[Socket] disconnected')
    );

    this.socket.on('new_message',  (msg: SocketMessage)   => this.newMessage$.next(msg));
    this.socket.on('user_typing',  (evt: TypingEvent)      => this.userTyping$.next(evt));
    this.socket.on('notification', (notif: Notification)   => this.notification$.next(notif));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  // ─── Rooms ──────────────────────────────────────────────────────────────────

  joinConversation(conversationId: string): void {
    this.socket?.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('leave_conversation', { conversationId });
  }

  // ─── Messaging ──────────────────────────────────────────────────────────────

  sendMessage(conversationId: string, text: string): void {
    const token = localStorage.getItem('token');
    this.socket?.emit('send_message', { conversationId, text, token });
  }

  // ─── Typing ─────────────────────────────────────────────────────────────────

  sendTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { conversationId, isTyping });
  }
}