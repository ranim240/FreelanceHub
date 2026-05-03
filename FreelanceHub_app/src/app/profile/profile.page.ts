import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

  // ── Section active (null = aucune) ─────────
  activeSection: 'personal' | 'education' | 'work' | null = null;

  // ── Flags sections complétées ──────────────
  personalDone  = false;
  educationDone = false;
  workDone      = false;

  // ── Progression ────────────────────────────
  get completionPercent(): number {
    return this.profileService.getCompletionPercent();
  }

  // ── Modèles de données ─────────────────────
  personal: any = {};
  education: any = {};
  work: any = {};

  constructor(
    private router: Router,
    private profileService: ProfileService
    , private auth: AuthService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadData();
  }

  loading = false;
  error = '';

  loadData() {
    const user = this.auth.currentUser;
    if (!user || !user._id) {
      this.error = 'Utilisateur non connecté';
      return;
    }

    this.loading = true;
    this.profileService.getProfile(user._id).subscribe({
      next: (profile) => {
        this.personal = profile || {};
        this.loading = false;
      },
      error: (err) => {
        console.error('Load profile error:', err);
        this.error = 'Erreur chargement profil';
        this.loading = false;
      }
    });

    // Legacy local data for education/work (to be extended later)
    this.education = this.profileService.getEducation();
    this.work = this.profileService.getWork();

    this.personalDone = this.profileService.isPersonalComplete();
    this.educationDone = this.profileService.isEducationComplete();
    this.workDone = this.profileService.isWorkComplete();
  }

  // ── Ouvrir / fermer une section ────────────
  openSection(section: 'personal' | 'education' | 'work') {
    this.activeSection = section;
    // Empêche le scroll du body quand le sheet est ouvert
    document.body.style.overflow = 'hidden';
  }

  closeSection() {
    this.activeSection = null;
    document.body.style.overflow = '';
  }

  // ── Sauvegardes ────────────────────────────
  savePersonal() {
    if (!this.personal.firstName || !this.personal.lastName) {
      alert('Nom et prénom obligatoires.');
      return;
    }

    const user = this.auth.currentUser;
    if (!user || !user._id) {
      alert('Utilisateur non connecté.');
      return;
    }

    this.loading = true;
    this.profileService.updateProfile(user._id, {
      firstName: this.personal.firstName,
      lastName: this.personal.lastName,
      phone: this.personal.phone,
      gender: this.personal.gender,
      location: this.personal.location,
      bio: this.personal.bio,
      domain: this.personal.domain,
      avatarUrl: this.personal.avatarUrl
    }).subscribe({
      next: () => {
        this.profileService.setPersonal(this.personal);  // Update local
        this.personalDone = true;
        this.closeSection();
        this.loading = false;
        alert('Profil mis à jour !');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Erreur sauvegarde.');
        this.loading = false;
      }
    });
  }

  saveEducation() {
    if (!this.education.degree || !this.education.year || !this.education.school) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    // Save to service
    this.profileService.setEducation(this.education);
    this.educationDone = true;
    this.closeSection();
  }

  saveWork() {
    if (!this.work.jobTitle || !this.work.company || !this.work.fromDate) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    // Save to service
    this.profileService.setWork(this.work);
    this.workDone = true;
    this.closeSection();
  }

  // ── Voir le profil public ──────────────────
  viewProfile() {
    this.router.navigate(['/profile-view']);
  }

  // ── Logout ────────────────────────────────
  logout() {
    // Clear profile data and logout via auth service
    this.profileService.clearAll();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  goBack() {
    this.router.navigate(['/profile-view']);
  }
}
