import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private personal = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    location: '',
    bio: '',
    avatarUrl: '',
  };

  private education = {
    degree: '',
    year: '',
    school: '',
    department: '',
    description: '',
  };

  private work = {
    jobTitle: '',
    company: '',
    fromDate: '',
    toDate: '',
    description: '',
  };

  // ── Setters ────────────────────────────────
  setPersonal(data: any)   { this.personal   = { ...this.personal,   ...data }; }
  setEducation(data: any)  { this.education  = { ...this.education,  ...data }; }
  setWork(data: any)       { this.work       = { ...this.work,       ...data }; }

  // ── Getters ────────────────────────────────
  getPersonal()   { return this.personal;  }
  getEducation()  { return this.education; }
  getWork()       { return this.work;      }

  // ── Check if section is completed ─────────
  isPersonalComplete(): boolean {
    return !!(this.personal.firstName && this.personal.lastName && this.personal.email);
  }

  isEducationComplete(): boolean {
    return !!(this.education.degree && this.education.year && this.education.school);
  }

  isWorkComplete(): boolean {
    return !!(this.work.jobTitle && this.work.company && this.work.fromDate);
  }

  // ── Get completion percentage ─────────────
  getCompletionPercent(): number {
    let pct = 0;
    if (this.isPersonalComplete())  pct += 34;
    if (this.isEducationComplete()) pct += 33;
    if (this.isWorkComplete())      pct += 33;
    return pct;
  }

  // ── Clear all data ────────────────────────
  clearAll() {
    this.personal = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      location: '',
      bio: '',
      avatarUrl: '',
    };
    this.education = {
      degree: '',
      year: '',
      school: '',
      department: '',
      description: '',
    };
    this.work = {
      jobTitle: '',
      company: '',
      fromDate: '',
      toDate: '',
      description: '',
    };
  }
}
