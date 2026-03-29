import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  standalone: false,
})
export class ClientPage implements OnInit, OnDestroy {
  menuItems = [
    { label: 'Dashboard', icon: 'grid-outline', path: '/client/dashboard' },
    { label: 'Announcements', icon: 'megaphone-outline', path: '/client/announcements' },
    { label: 'Freelancers', icon: 'people-outline', path: '/client/freelancers' },
    { label: 'Products', icon: 'cube-outline', path: '/client/products' },
    { label: 'Messages', icon: 'chatbubbles-outline', path: '/client/messages' },
    { label: 'Notifications', icon: 'notifications-outline', path: '/client/notifications' },
  ];

  clientName = 'Client';

  constructor(
    private router: Router,
    private auth: AuthService,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.menuCtrl.enable(false, 'main-menu');
    this.menuCtrl.enable(true, 'client-menu');
    this.loadClientName();
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true, 'main-menu');
    this.menuCtrl.enable(false, 'client-menu');
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  /**
   * Load client name from localStorage or use default
   */
  loadClientName() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.clientName = userData.firstName || 'Client';
      } catch (e) {
        this.clientName = 'Client';
      }
    }
  }

  navigateTo(path: string) {
    this.menuCtrl.close('client-menu');
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
