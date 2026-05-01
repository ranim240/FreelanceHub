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

  loadData() {
    // Load data from service
    this.personal = { ...this.profileService.getPersonal() };
    this.education = { ...this.profileService.getEducation() };
    this.work = { ...this.profileService.getWork() };

    // Merge authenticated user data when available
    const user = this.auth.currentUser;
    if (user) {
      this.personal = { ...user, ...this.personal };
      this.personal.firstName = this.personal.firstName || user.firstName || '';
      this.personal.lastName = this.personal.lastName || user.lastName || '';
      this.personal.email = this.personal.email || user.email || '';
      this.personal.avatar = this.personal.avatar || user.avatarUrl || '';
    }

    // Check completion status
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
    if (!this.personal.firstName || !this.personal.lastName || !this.personal.email) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    // Save to service
    this.profileService.setPersonal(this.personal);
    this.personalDone = true;
    this.closeSection();
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
