import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.page.html',
  styleUrls: ['./client-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ClientDashboardPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser$ = this.authService.user$;
  selectedTab = 'posts';

  constructor() {}

  onTabChange(event: any) {
    const tab = event.detail.value;
    this.router.navigate([`/client-dashboard/${tab}`]);
  }

  goHome() { 
    this.router.navigate(['/home']); 
  }
  goWallet() { 
    this.router.navigate(['client-dashboard/panier']); 
  }
  goProfile() { 
    this.router.navigate(['client-dashboard/parametres']); 
  }
}

