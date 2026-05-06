import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false,
})
export class MessagesPage implements OnInit, OnDestroy {

  @ViewChild('chatMessages') chatMessages!: ElementRef;

  searchText = '';
  activeChatId: string | null = null;
  activeConv: any = null;
  newMessage = '';
  isTyping = false;
  loadingMessages = false;

  conversations: any[] = [];
  messages: any[] = [];

  private typingTimer: any;
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private messageService: MessageService,
  ) {}

ngOnInit() {
  // 1. Charger les conversations UNE SEULE FOIS
  this.messageService.getConversations().subscribe({
    next: (data) => {
      this.conversations = data;
    },
    error: err => console.error('Erreur chargement conversations', err),
  });

  // 2. Écouter les queryParams INDÉPENDAMMENT
  // Se déclenche à chaque changement, même si on est déjà sur la page
  this.subs.push(
    this.route.queryParams.subscribe(params => {
      const convId = params['conversationId'];
      if (!convId) return;

      // Chercher dans la liste déjà chargée
      const conv = this.conversations.find(c => c._id === convId);
      if (conv) {
        this.openChat(conv);
      } else {
        // Pas encore chargée — recharger et réessayer
        this.messageService.getConversations().subscribe(fresh => {
          this.conversations = fresh;
          const freshConv = fresh.find((c: any) => c._id === convId);
          if (freshConv) this.openChat(freshConv);
        });
      }
    })
  );

  // 3. Socket: nouveau message
  this.subs.push(
    this.socketService.newMessage$.subscribe(msg => {
      const currentUserId = localStorage.getItem('token');
      if (msg.senderId === currentUserId) return;

      this.messages.push({ ...msg, mine: false });

      const conv = this.conversations.find(c => c._id === this.activeChatId);
      if (conv) {
        conv.lastMessage = msg.text;
        conv.time = msg.time;
      }
      this.scrollToBottom();
    })
  );

  // 4. Socket: typing
  this.subs.push(
    this.socketService.userTyping$.subscribe(evt => {
      if (evt.conversationId === this.activeChatId) {
        this.isTyping = evt.isTyping;
      }
    })
  );
}

  ngOnDestroy() {
    if (this.activeChatId) {
      this.socketService.leaveConversation(this.activeChatId);
    }
    this.subs.forEach(s => s.unsubscribe());
    clearTimeout(this.typingTimer);
  }

  // ✅ FIX: méthode bien dans la classe
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop =
          this.chatMessages.nativeElement.scrollHeight;
      }
    }, 50);
  }

  get filteredConversations() {
    return this.conversations.filter(c =>
      !this.searchText ||
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openChat(conv: any) {
    if (this.activeChatId) {
      this.socketService.leaveConversation(this.activeChatId);
    }

    this.activeChatId = conv._id;
    this.activeConv = conv;
    conv.unread = 0;
    this.messages = [];
    this.loadingMessages = true;

    this.socketService.joinConversation(conv._id);

    this.messageService.getMessages(conv._id).subscribe({
      next: msgs => {
        this.messages = msgs;
        this.loadingMessages = false;
        this.scrollToBottom();
      },
      error: err => {
        console.error('Erreur chargement messages', err);
        this.loadingMessages = false;
      },
    });
  }

  closeChat() {
    if (this.activeChatId) {
      this.socketService.leaveConversation(this.activeChatId);
    }
    this.activeChatId = null;
    this.activeConv = null;
    this.messages = [];
    this.loadingMessages = false;
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text || !this.activeChatId) return;

    this.messages.push({
      text,
      mine: true,
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
    });

    this.socketService.sendMessage(this.activeChatId, text);

    if (this.activeConv) this.activeConv.lastMessage = text;

    this.newMessage = '';
    this.scrollToBottom(); // ✅ amélioration UX
  }

  onTyping() {
    if (!this.activeChatId) return;

    this.socketService.sendTyping(this.activeChatId, true);

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.socketService.sendTyping(this.activeChatId!, false);
    }, 2000);
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}