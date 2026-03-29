import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false
})
export class UsersPage implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText = '';
  roleFilter = '';
  currentTab = 'all'; // 'all' | 'clients' | 'freelancers' | 'pending'
  
  selectedUser: any = null;
  isUserModalOpen = false;

  constructor(
    private adminService: AdminService, 
    private navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) this.currentTab = params['tab'];
      if (params['role']) this.roleFilter = params['role'];
      if (params['status']) {
        // Find existing users with this status 
        // Note: applyFilters uses u.status
      }
      this.loadUsers();
    });
  }

  get pendingCount() {
    return this.users.filter(u => u.status === 'pending').length;
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  applyFilters() {
    const statusParam = this.route.snapshot.queryParams['status'];
    
    this.filteredUsers = this.users.filter(u => {
      const matchSearch = !this.searchText ||
        (u.firstName + ' ' + u.lastName + ' ' + u.email)
          .toLowerCase().includes(this.searchText.toLowerCase());
          
      const matchTab = this.currentTab === 'pending' ? (u.status === 'pending') : (u.status !== 'pending');
      const matchRole = !this.roleFilter || u.role === this.roleFilter;
      const matchStatus = !statusParam || u.status === statusParam;
      
      return matchSearch && matchTab && matchRole && matchStatus;
    });
  }

  setTab(tab: 'all' | 'pending') {
    this.currentTab = tab;
    this.roleFilter = '';
    this.applyFilters();
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  changeStatus(userId: string, status: string) {
    this.adminService.updateUserStatus(userId, status).subscribe({
      next: () => {
        this.showToast(`Status updated to ${status}`);
        this.loadUsers();
      },
      error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
    });
  }

  validateFreelancer(userId: string, action: 'approve' | 'reject') {
    this.adminService.validateFreelancer(userId, action).subscribe({
      next: () => {
        const msg = action === 'approve' ? 'Freelancer application approved' : 'Freelancer application rejected';
        this.showToast(msg);
        this.loadUsers();
      },
      error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.showToast('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  openUserModal(user: any) {
    this.selectedUser = user;
    this.isUserModalOpen = true;
  }

  closeUserModal() {
    this.isUserModalOpen = false;
    setTimeout(() => this.selectedUser = null, 300);
  }

  setFilter(filter: string) {
    this.roleFilter = filter;
    this.applyFilters();
  }

  goTo(page: string) {
    this.navCtrl.navigateRoot(['/admin', page]);
  }
}
