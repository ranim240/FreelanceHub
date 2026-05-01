import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit, OnDestroy {
  menuItems = [
    { label: 'Dashboard', icon: 'grid-outline', path: '/admin/dashboard' },
    { label: 'Users', icon: 'people-outline', path: '/admin/users' },
    { label: 'Products', icon: 'cube-outline', path: '/admin/products' },
    { label: 'Announcements', icon: 'megaphone-outline', path: '/admin/announcements' },
    { label: 'Categories', icon: 'pricetags-outline', path: '/admin/categories' },
    { label: 'Reports', icon: 'flag-outline', path: '/admin/reports' },
    { label: 'Escrow', icon: 'lock-closed-outline', path: '/admin/contracts' },
  ];

  constructor(
    private router: Router, 
    private auth: AuthService,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.menuCtrl.enable(false, 'main-menu');
    this.menuCtrl.enable(true, 'admin-menu');
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true, 'main-menu');
    this.menuCtrl.enable(false, 'admin-menu');
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  navigateTo(path: string) {
    this.navCtrl.navigateRoot(path);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
