import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-announcement',
  templateUrl: './post-announcement.page.html',
  styleUrls: ['./post-announcement.page.scss'],
  standalone: false,
})
export class PostAnnouncementPage implements OnInit {

  // ── Step ───────────────────────────────────
  currentStep = 1;

  // ── Skill temporaire ───────────────────────
  newSkill = '';

  // ── Options deadline ──────────────────────
  deadlineOptions = [
    { label: '3 days',   value: '3 days'   },
    { label: '7 days',   value: '7 days'   },
    { label: '2 weeks',  value: '2 weeks'  },
    { label: '1 month',  value: '1 month'  },
    { label: 'Flexible', value: 'Flexible' },
  ];

  // ── Modèle annonce ─────────────────────────
  announcement = {
    title:        '',
    category:     '',
    description:  '',
    skills:       [] as string[],
    urgency:      'open',
    budgetType:   'range',
    budgetFixed:  '',
    budgetMin:    '',
    budgetMax:    '',
    deadline:     '7 days',
    deadlineDate: '',
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  // ── Skills ─────────────────────────────────
  addSkill() {
    const s = this.newSkill.trim();
    if (s && !this.announcement.skills.includes(s)) {
      this.announcement.skills.push(s);
    }
    this.newSkill = '';
  }

  removeSkill(index: number) {
    this.announcement.skills.splice(index, 1);
  }

  // ── Navigation étapes ──────────────────────
  nextStep() {
    if (this.currentStep === 1) {
      if (!this.announcement.title || !this.announcement.category || !this.announcement.description) {
        alert('Please fill in all required fields.');
        return;
      }
    }
    if (this.currentStep === 2) {
      const hasFixed = this.announcement.budgetType === 'fixed' && this.announcement.budgetFixed;
      const hasRange = this.announcement.budgetType === 'range'
        && this.announcement.budgetMin && this.announcement.budgetMax;
      if (!hasFixed && !hasRange) {
        alert('Please enter a budget.');
        return;
      }
      if (!this.announcement.deadline && !this.announcement.deadlineDate) {
        alert('Please select a deadline.');
        return;
      }
    }
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  // ── Soumission ─────────────────────────────
  submit() {
    console.log('Announcement submitted:', this.announcement);
    // TODO: appeler AnnouncementService.create(this.announcement)
    // Puis naviguer vers la liste des annonces
    this.router.navigate(['/client/announcements']);
  }

  // ── Helper initiales ───────────────────────
  getInitials(): string {
    if (!this.announcement.title) return '??';
    return this.announcement.title
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('');
  }
}