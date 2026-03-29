import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,

})

export class DashboardPage implements OnInit {

  // ── State ──────────────────────────────────
  menuOpen     = false;
  clientName   = 'john';
  todayDate    = '';

  // ── Stats ──────────────────────────────────
  stats = {
    announcements: 3,
    freelancers:   12,
    products:      8,
    messages:      2,
  };

  // ── Mes annonces (données exemple) ─────────
  myAnnouncements = [
    {
      initials:    'KT',
      title:       'SEO Articles for Tech Blog',
      timeAgo:     '1 day ago',
      status:      'Urgent',
      description: 'Looking for an experienced writer to produce 10 SEO-optimized articles on AI, cybersecurity and cloud...',
      tags:        ['SEO', 'Writing', 'AI'],
      budget:      '150 – 250 DT',
      deadline:    '7 days',
    },
    {
      initials:    'SM',
      title:       'Logo Design & Brand Identity',
      timeAgo:     '5 hours ago',
      status:      'Open',
      description: 'Need a designer to create a professional logo and complete brand guidelines for a FinTech startup.',
      tags:        ['Logo', 'Figma', 'Branding'],
      budget:      '300 – 500 DT',
      deadline:    '10 days',
    },
  ];

  // ── Top Freelancers (données exemple) ──────
  topFreelancers = [
    { initials: 'AB', name: 'Anis Ben Ali',     domain: 'UI/UX Design',      rating: '4.9' },
    { initials: 'SR', name: 'Sarra Rhouma',     domain: 'Web Development',   rating: '4.8' },
    { initials: 'MK', name: 'Mohamed Khelifi',  domain: 'Content Writing',   rating: '4.7' },
  ];

  // ── Produits récents (données exemple) ─────
  recentProducts = [
    { name: 'SEO Content Template Pack', seller: 'ContentPro', price: 80,  rating: '4.3' },
    { name: 'Brand Identity Mega Pack',  seller: 'CreativeHub', price: 120, rating: '4.4' },
    { name: 'React Dashboard UI Kit',    seller: 'DevStudio',   price: 60,  rating: '4.6' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.todayDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day:     'numeric',
      month:   'long',
      year:    'numeric',
    });
  }

  // ── Navigation ─────────────────────────────
  goTo(page: string) {
    this.router.navigate(['/' + page]);
  }

  navigate(page: string) {
    this.menuOpen = false;
    setTimeout(() => this.router.navigate(['/' + page]), 300);
  }

  // ── Menu ───────────────────────────────────
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // ── Déconnexion ────────────────────────────
  logout() {
    this.menuOpen = false;
    // TODO: appeler AuthService.logout()
    this.router.navigate(['/login']);
  }
}