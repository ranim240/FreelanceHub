import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
  standalone: false,
})
export class ProfileViewPage implements OnInit {

  // ── Données récupérées depuis le service ───
  profile: any  = {};
  education: any = {};
  work: any      = {};
  profileName = 'Your Name';

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    // Récupère les données sauvegardées depuis freelancer-profile
    this.profile   = this.profileService.getPersonal();
    this.education = this.profileService.getEducation();
    this.work      = this.profileService.getWork();
    
    // keep display name in sync with authenticated user when available
    const user = this.auth.currentUser;
    if (user) {
      const first = user.firstName || '';
      const last = user.lastName || '';
      if (first || last) {
        this.profileName = `${first} ${last}`.trim();
      } else if (user.email) {
        this.profileName = user.email.split('@')[0];
      }
      this.profile = { ...this.profile, ...user };
    } else {
      this.profileName = (this.profile.firstName || this.profile.email || 'Your Name');
    }
  }

  // ── Retour vers la page d'édition ─────────
  goToEdit() {
    this.router.navigate(['/profile']);
  }

  // ── Helpers d'affichage ───────────────────
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getCountry(): string {
    if (!this.profile.location) return '';
    const parts = this.profile.location.split(',');
    return parts[parts.length - 1]?.trim() || '';
  }
  goBack() {
    this.router.navigate(['/home']);
  }

  // ── Logout ------------------------------------------------
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // ── Bottom tab helpers (mirror home.page navigators) ─────────
  goToSearch(): void {
    this.router.navigate(['/store']);
  }

  goToStore(): void {
    this.router.navigate(['/store']);
  }

  goToMessages(): void {
    // placeholder until messaging feature implemented
    console.log('Navigate to messages');
    this.router.navigate(['/client/messages']);
  }

  goToReports(): void {
    this.router.navigate(['/client/reports']);
  }

  goToProfile(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.role === 'client') {
      this.router.navigate(['/client/dashboard']);
    } else {
      this.router.navigate(['/profile-view']);
    }
  }
}