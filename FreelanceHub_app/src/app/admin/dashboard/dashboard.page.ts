import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminStats } from '../../models/admin.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  stats: AdminStats | null = null;
  recentUsers: any[] = [];
  
  selectedUser: any = null;
  isUserModalOpen = false;

  today: string = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  constructor(private adminService: AdminService, private router: Router, private auth: AuthService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentUsers();
  }
  get currentUser() {
    return this.auth.currentUser;
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Erreur stats:', err)
    });
  }

  loadRecentUsers() {
    this.adminService.getUsers().subscribe({
      next: (users) => this.recentUsers = users.slice(0, 5),
      error: (err) => console.error('Erreur users:', err)
    });
  }

  openUserModal(user: any) {
    this.selectedUser = user;
    this.isUserModalOpen = true;
  }

  closeUserModal() {
    this.isUserModalOpen = false;
    setTimeout(() => this.selectedUser = null, 300);
  }

  goTo(page: string) {
    this.navCtrl.navigateRoot(['/admin', page]);
  }

  goToUsers(tab: string, role: string = '', status: string = '') {
    this.navCtrl.navigateRoot(['/admin/users'], {
      queryParams: { tab, role, status }
    });
  }
}
