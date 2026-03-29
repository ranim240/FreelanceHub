import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false,
})
export class MessagesPage implements OnInit {

  searchText   = '';
  activeChatId: number | null = null;
  activeConv:   any = null;
  newMessage   = '';

  conversations = [
    {
      id: 1, initials: 'AB', name: 'Anis Ben Ali',
      avatarColor: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)',
      lastMessage: 'Sure, I can start on Monday!',
      time: '10:32', unread: 2, online: true,
    },
    {
      id: 2, initials: 'SR', name: 'Sarra Rhouma',
      avatarColor: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
      lastMessage: 'Please send me the project details.',
      time: 'Yesterday', unread: 0, online: false,
    },
    {
      id: 3, initials: 'MK', name: 'Mohamed Khelifi',
      avatarColor: 'linear-gradient(135deg, #92400e 0%, #f97316 100%)',
      lastMessage: 'The first draft is ready for review.',
      time: 'Mon', unread: 1, online: true,
    },
  ];

  // Messages par conversation
  messagesMap: { [key: number]: any[] } = {
    1: [
      { text: 'Hello! I saw your announcement about UI design.', mine: false, time: '10:20' },
      { text: 'Hi! Yes, I need a complete redesign for my app.', mine: true,  time: '10:22' },
      { text: 'I have 6 years of experience with Figma and mobile design.', mine: false, time: '10:25' },
      { text: 'Great! Can you start this week?', mine: true,  time: '10:28' },
      { text: 'Sure, I can start on Monday!', mine: false, time: '10:32' },
    ],
    2: [
      { text: 'Hi, I am interested in your development project.', mine: false, time: 'Yesterday' },
      { text: 'Please send me the project details.', mine: false, time: 'Yesterday' },
    ],
    3: [
      { text: 'I finished the first 3 articles.', mine: false, time: 'Mon' },
      { text: 'The first draft is ready for review.', mine: false, time: 'Mon' },
    ],
  };

  get activeMessages() {
    return this.activeChatId ? (this.messagesMap[this.activeChatId] || []) : [];
  }

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: this.http.get('/api/client/messages').subscribe(...)
  }

  get filteredConversations() {
    return this.conversations.filter(c =>
      !this.searchText ||
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openChat(conv: any) {
    this.activeChatId = conv.id;
    this.activeConv   = conv;
    conv.unread       = 0;
  }

  closeChat() {
    this.activeChatId = null;
    this.activeConv   = null;
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text || !this.activeChatId) return;

    if (!this.messagesMap[this.activeChatId]) {
      this.messagesMap[this.activeChatId] = [];
    }

    this.messagesMap[this.activeChatId].push({
      text,
      mine: true,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });

    // Mise à jour dernière message
    const conv = this.conversations.find(c => c.id === this.activeChatId);
    if (conv) conv.lastMessage = text;

    this.newMessage = '';
    // TODO: envoyer via Flask Socket.IO ou API REST
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}