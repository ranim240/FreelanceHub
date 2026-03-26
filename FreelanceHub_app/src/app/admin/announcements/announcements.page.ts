import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
  standalone: false
})
export class AnnouncementsPage implements OnInit {
  announcements: any[] = [];
  filteredAnnouncements: any[] = [];
  searchText = '';
  statusFilter = '';

  constructor(
    private adminService: AdminService, 
    private router: Router, 
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.adminService.getAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  applyFilters() {
    this.filteredAnnouncements = this.announcements.filter(a => {
      const matchSearch = !this.searchText || 
        a.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.client?.firstName + ' ' + a.client?.lastName).toLowerCase().includes(this.searchText.toLowerCase());
      const matchStatus = !this.statusFilter || a.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  deleteAnnouncement(id: string) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.adminService.deleteAnnouncement(id).subscribe({
        next: () => {
          this.showToast('Announcement deleted successfully');
          this.loadAnnouncements();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  setFilter(filter: string) {
    this.statusFilter = filter;
    this.applyFilters();
  }

  goTo(page: string) {
    this.navCtrl.navigateRoot(['/admin', page]);
  }
}
