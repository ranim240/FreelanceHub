import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {

  activeFilter = 'all';

  filters = [
    { label: 'All',       value: 'all',      count: 0 },
    { label: 'Unread',    value: 'unread',   count: 0 },
    { label: 'Messages',  value: 'message',  count: 0 },
    { label: 'Proposals', value: 'proposal', count: 0 },
    { label: 'System',    value: 'system',   count: 0 },
  ];

  notifications = [
    {
      id: 1, type: 'proposal', read: false,
      title: 'New proposal received',
      description: 'Anis Ben Ali submitted a proposal for "Logo Design & Brand Identity".',
      time: '5 minutes ago',
    },
    {
      id: 2, type: 'message', read: false,
      title: 'New message from Sarra Rhouma',
      description: 'Please send me the full project requirements so I can start immediately.',
      time: '1 hour ago',
    },
    {
      id: 3, type: 'success', read: false,
      title: 'Announcement approved',
      description: 'Your announcement "SEO Articles for Tech Blog" is now live.',
      time: '2 hours ago',
    },
    {
      id: 4, type: 'system', read: true,
      title: 'Profile incomplete',
      description: 'Complete your company profile to get better visibility with freelancers.',
      time: '1 day ago',
    },
    {
      id: 5, type: 'proposal', read: true,
      title: '3 new proposals',
      description: 'Your announcement "E-commerce Mobile App" received 3 new proposals.',
      time: '2 days ago',
    },
    {
      id: 6, type: 'alert', read: true,
      title: 'Announcement expiring soon',
      description: 'Your announcement "Social Media Strategy" will expire in 2 days.',
      time: '3 days ago',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateCounts();
    // TODO: this.http.get('/api/client/notifications').subscribe(...)
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
    // TODO: this.http.put(`/api/notifications/${n.id}/read`, {}).subscribe()
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateCounts();
    // TODO: this.http.put('/api/notifications/read-all', {}).subscribe()
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