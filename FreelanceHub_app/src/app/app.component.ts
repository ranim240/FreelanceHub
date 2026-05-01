import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router, private menuCtrl: MenuController) {}

  goTo(path: string): void {
    this.menuCtrl.close('main-menu');
    this.router.navigate([path]);
  }

  goToProfile(): void {
    this.menuCtrl.close('main-menu');
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.role === 'client') {
      this.router.navigate(['/client/dashboard']);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  goToMessages(): void {
    this.menuCtrl.close('main-menu');
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    // Clients and potentially others go to /client/messages
    this.router.navigate(['/client/messages']);
  }

  goToReports(): void {
    this.menuCtrl.close('main-menu');
    this.router.navigate(['/client/reports']);
  }
}