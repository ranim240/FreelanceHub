import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';

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

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    // Récupère les données sauvegardées depuis freelancer-profile
    this.profile   = this.profileService.getPersonal();
    this.education = this.profileService.getEducation();
    this.work      = this.profileService.getWork();
  }

  // ── Retour vers la page d'édition ─────────
  goToEdit() {
    this.router.navigate(['/profil']);
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
}