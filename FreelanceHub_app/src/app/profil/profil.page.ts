import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  standalone: false,
})
export class ProfilPage implements OnInit {

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
  ) {}

  ngOnInit() {
    // Load data from service
    this.personal = this.profileService.getPersonal();
    this.education = this.profileService.getEducation();
    this.work = this.profileService.getWork();

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
    // Clear user data from service
    this.profileService.clearAll();
    // Clear localStorage
    localStorage.clear();
    // Navigate to login page
    this.router.navigate(['/login']);
  }
  goBack() {
    this.router.navigate(['/profile-view']);
  }
}
