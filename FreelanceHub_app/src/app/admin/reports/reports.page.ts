import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Report } from '../../models/admin.model';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false
})
export class ReportsPage implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  searchText = '';
  currentStatus = 'all'; // 'all' | 'pending' | 'resolved' | 'ignored'

  constructor(
    private adminService: AdminService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.adminService.getReports(this.currentStatus === 'all' ? undefined : this.currentStatus).subscribe({
      next: (data) => {
        this.reports = data;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur chargement reports:', err)
    });
  }

  applyFilters() {
    this.filteredReports = this.reports.filter(r => {
      const matchSearch = !this.searchText ||
        (r.reportedBy.name + ' ' + r.targetName + ' ' + r.reason + ' ' + r.description)
          .toLowerCase().includes(this.searchText.toLowerCase());
      return matchSearch;
    });
  }

  setStatus(status: string) {
    this.currentStatus = status;
    this.loadReports();
  }

  async resolveReport(id: string) {
    this.adminService.resolveReport(id).subscribe({
      next: () => {
        this.showToast('Report resolved');
        this.loadReports();
      },
      error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
    });
  }

  async ignoreReport(id: string) {
    this.adminService.ignoreReport(id).subscribe({
      next: () => {
        this.showToast('Report ignored');
        this.loadReports();
      },
      error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
    });
  }

  async deleteReport(id: string) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.adminService.deleteReport(id).subscribe({
        next: () => {
          this.showToast('Report deleted successfully');
          this.loadReports();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  goTo(page: string) {
    this.navCtrl.navigateRoot(['/admin', page]);
  }
}
