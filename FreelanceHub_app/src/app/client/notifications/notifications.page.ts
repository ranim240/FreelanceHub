import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {

  activeFilter = 'all';
  isLoading = true;
  error = '';

  filters = [
    { label: 'All',       value: 'all',      count: 0 },
    { label: 'Unread',    value: 'unread',   count: 0 },
    { label: 'Messages',  value: 'message',  count: 0 },
    { label: 'Proposals', value: 'proposal', count: 0 },
    { label: 'System',    value: 'system',   count: 0 },
  ];

  notifications: any[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private clientService: ClientService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.loadNotifications(user._id);
    }
    this.updateCounts();
  }

  loadNotifications(userId: string) {
    this.isLoading = true;
    this.error = '';
    this.clientService.getNotifications(userId).subscribe({
      next: (data: any[]) => {
        this.notifications = data;
        this.updateCounts();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading notifications:', err);
        this.error = 'Failed to load notifications';
        this.isLoading = false;
        this.toastController.create({
          message: 'Erreur chargement notifications',
          duration: 2000,
          color: 'danger'
        }).then(toast => toast.present());
      }
    });
  }

  updateCounts() {
    const unread = this.notifications.filter(n => !n.read);
    this.filters[0].count = unread.length;
    this.filters[1].count = unread.length;
    this.filters[2].count = unread.filter(n => n.type === 'message').length;
    this.filters[3].count = unread.filter(n => n.type === 'proposal').length;
    this.filters[4].count = unread.filter(n => n.type === 'system').length;
  }

  get hasUnread() {
    return this.notifications.some(n => !n.read);
  }

  setFilter(value: string) {
    this.activeFilter = value;
  }

  get filteredNotifications() {
    return this.notifications.filter(n => {
      if (this.activeFilter === 'all')    return true;
      if (this.activeFilter === 'unread') return !n.read;
      return n.type === this.activeFilter;
    });
  }

  markRead(n: any) {
    n.read = true;
    this.updateCounts();
    // TODO: clientService.markNotificationRead(n.id)
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateCounts();
    // TODO: mark all read API
  }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      message:  'chatbubble-outline',
      proposal: 'person-add-outline',
      system:   'information-circle-outline',
      alert:    'warning-outline',
      success:  'checkmark-circle-outline',
    };
    return icons[type] || 'notifications-outline';
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}

