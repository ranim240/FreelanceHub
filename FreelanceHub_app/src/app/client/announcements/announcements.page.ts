import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
  standalone: false,
})
export class AnnouncementsPage implements OnInit {

  searchText   = '';
  activeFilter = 'all';

  // ── Filtres ────────────────────────────────
  filters = [
    { label: 'All',     value: 'all',     count: 0 },
    { label: 'Open',    value: 'open',    count: 0 },
    { label: 'Urgent',  value: 'urgent',  count: 0 },
    { label: 'Pending', value: 'pending', count: 0 },
    { label: 'Closed',  value: 'closed',  count: 0 },
  ];

  // ── Données exemple ────────────────────────
  announcements = [
    {
      id: 1,
      initials:    'KT',
      title:       'SEO Articles for Tech Blog',
      timeAgo:     '1 day ago',
      status:      'Urgent',
      description: 'Looking for an experienced writer to produce 10 SEO-optimized articles on AI, cybersecurity and cloud computing.',
      tags:        ['SEO', 'Writing', 'AI'],
      budget:      '150 – 250 DT',
      deadline:    '7 days',
      proposals:   4,
    },
    {
      id: 2,
      initials:    'SM',
      title:       'Logo Design & Brand Identity',
      timeAgo:     '5 hours ago',
      status:      'Open',
      description: 'Need a designer to create a professional logo and complete brand guidelines for a FinTech startup.',
      tags:        ['Logo', 'Figma', 'Branding'],
      budget:      '300 – 500 DT',
      deadline:    '10 days',
      proposals:   7,
    },
    {
      id: 3,
      initials:    'AB',
      title:       'E-commerce Mobile App Development',
      timeAgo:     '2 hours ago',
      status:      'Pending',
      description: 'Building a full e-commerce mobile app with Ionic and Node.js backend. Need an experienced developer.',
      tags:        ['Ionic', 'Node.js', 'Mobile'],
      budget:      '1500 – 3000 DT',
      deadline:    '1 month',
      proposals:   0,
    },
    {
      id: 4,
      initials:    'MR',
      title:       'Social Media Content Strategy',
      timeAgo:     '3 days ago',
      status:      'Closed',
      description: 'Looking for a social media expert to create a 3-month content strategy for our brand.',
      tags:        ['Marketing', 'Social Media'],
      budget:      '200 – 400 DT',
      deadline:    '2 weeks',
      proposals:   12,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateCounts();
    // TODO: remplacer par un appel HTTP
    // this.http.get('/api/client/announcements').subscribe(...)
  }

  // ── Mise à jour des compteurs ──────────────
  updateCounts() {
    this.filters[0].count = this.announcements.length;
    this.filters[1].count = this.announcements.filter(a => a.status.toLowerCase() === 'open').length;
    this.filters[2].count = this.announcements.filter(a => a.status.toLowerCase() === 'urgent').length;
    this.filters[3].count = this.announcements.filter(a => a.status.toLowerCase() === 'pending').length;
    this.filters[4].count = this.announcements.filter(a => a.status.toLowerCase() === 'closed').length;
  }

  // ── Filtre actif ───────────────────────────
  setFilter(value: string) {
    this.activeFilter = value;
  }

  // ── Annonces filtrées + recherche ──────────
  get filteredAnnouncements() {
    return this.announcements.filter(a => {
      const matchFilter = this.activeFilter === 'all'
        || a.status.toLowerCase() === this.activeFilter;
      const matchSearch = !this.searchText
        || a.title.toLowerCase().includes(this.searchText.toLowerCase())
        || a.tags.some(t => t.toLowerCase().includes(this.searchText.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }

  // ── Actions ────────────────────────────────
  viewDetail(ann: any) {
    this.router.navigate(['/client/announcements', ann.id]);
  }

  editAnn(ann: any) {
    this.router.navigate(['/client/post-announcement'], {
      queryParams: { id: ann.id, edit: true }
    });
  }

  deleteAnn(ann: any) {
    // TODO: appeler l'API Flask DELETE /announcements/:id
    const confirmed = confirm(`Delete "${ann.title}"?`);
    if (confirmed) {
      this.announcements = this.announcements.filter(a => a.id !== ann.id);
      this.updateCounts();
    }
  }

  // ── Navigation ─────────────────────────────
  goToPost() {
    this.router.navigate(['/client/post-announcement']);
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}