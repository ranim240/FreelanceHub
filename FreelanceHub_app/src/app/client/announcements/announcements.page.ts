import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
  standalone: false,
})
export class AnnouncementsPage implements OnInit {

  searchText   = '';
  activeFilter = 'all';
  isLoading    = true;
  error        = '';

  // ── Filtres ────────────────────────────────
  filters = [
    { label: 'All',     value: 'all',     count: 0 },
    { label: 'Open',    value: 'open',    count: 0 },
    { label: 'Urgent',  value: 'urgent',  count: 0 },
    { label: 'Pending', value: 'pending', count: 0 },
    { label: 'Closed',  value: 'closed',  count: 0 },
  ];

  announcements: any[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private clientService: ClientService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      await this.loadAnnouncements(user._id);
    }
  }

  async loadAnnouncements(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.error = '';
      this.clientService.getAnnouncements(userId).subscribe({
        next: (data: any[]) => {
          this.announcements = data;
          this.updateCounts();
          this.isLoading = false;
          resolve();
        },
        error: (err: any) => {
          console.error('Error loading announcements:', err);
          this.error = 'Failed to load announcements';
          this.isLoading = false;
          this.presentToast(`Failed to load announcements: ${err.message || err.status || 'Unknown error'}`, 'danger');
          reject(err);
        }
      });
    });
  }

  // ── Mise à jour des compteurs ──────────────
  updateCounts() {
    this.filters[0].count = this.announcements.length;
    this.filters[1].count = this.announcements.filter(a => a.status?.toLowerCase() === 'open').length;
    this.filters[2].count = this.announcements.filter(a => a.status?.toLowerCase() === 'urgent').length;
    this.filters[3].count = this.announcements.filter(a => a.status?.toLowerCase() === 'pending').length;
    this.filters[4].count = this.announcements.filter(a => a.status?.toLowerCase() === 'closed').length;
  }

  // ── Filtre actif ───────────────────────────
  setFilter(value: string) {
    this.activeFilter = value;
  }

  // ── Annonces filtrées + recherche ──────────
  get filteredAnnouncements() {
    return this.announcements.filter(a => {
      const matchFilter = this.activeFilter === 'all'
        || (a.status && a.status.toLowerCase() === this.activeFilter);
      const matchSearch = !this.searchText
        || (a.title && a.title.toLowerCase().includes(this.searchText.toLowerCase()))
        || (a.tags && a.tags.some((t: string) => t.toLowerCase().includes(this.searchText.toLowerCase())));
      return matchFilter && matchSearch;
    });
  }

  // ── Actions ────────────────────────────────
  viewDetail(ann: any) {
    this.router.navigate(['/client/announcements', ann._id]);
  }

  editAnn(ann: any) {
    this.router.navigate(['/client/post-announcement'], {
      queryParams: { id: ann._id, edit: true }
    });
  }

  deleteAnn(ann: any) {
    const confirmed = confirm(`Delete "${ann.title}"?`);
    if (confirmed) {
      const userId = this.auth.currentUser!._id!;
      this.clientService.deleteAnnouncement(userId, ann._id).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(a => a._id !== ann._id);
          this.updateCounts();
          this.presentToast('Announcement deleted successfully', 'success');
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.presentToast('Failed to delete announcement', 'danger');
        }
      });
    }
  }

  // ── Navigation ─────────────────────────────
  goToPost() {
    this.router.navigate(['/client/post-announcement']);
  }

  doRefresh(event: any) {
    const user = this.auth.currentUser;
    if (user) {
      this.loadAnnouncements(user._id).then(() => {
        event.target.complete();
      }).catch(() => {
        event.target.complete();
      });
    } else {
      event.target.complete();
    }
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}

