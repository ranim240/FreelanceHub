import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientService } from '../../services/client.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-freelancers',
  templateUrl: './freelancers.page.html',
  styleUrls: ['./freelancers.page.scss'],
  standalone: false,
})
export class FreelancersPage implements OnInit {

  searchText   = '';
  activeDomain = 'all';
  isLoading    = true;
  error        = '';

  domains = [
    { label: 'All',       value: 'all',       icon: 'grid-outline'          },
    { label: 'Design',    value: 'design',    icon: 'color-palette-outline' },
    { label: 'Dev',       value: 'dev',       icon: 'code-slash-outline'    },
    { label: 'Writing',   value: 'writing',   icon: 'pencil-outline'        },
    { label: 'Marketing', value: 'marketing', icon: 'megaphone-outline'     },
    { label: 'Video',     value: 'video',     icon: 'videocam-outline'      },
    { label: 'Data',      value: 'data',      icon: 'stats-chart-outline'   },
  ];

  private avatarColors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6',
    '#F59E0B', '#3B82F6', '#10B981', '#EF4444',
  ];

  freelancers: any[] = [];

  constructor(
    private router:          Router,
    private clientService:   ClientService,
    private messageService:  MessageService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.loadFreelancers();
  }

  loadFreelancers(domain?: string) {
    this.isLoading = true;
    this.error     = '';
    this.clientService.getFreelancers(domain).subscribe({
      next: (data) => {
        this.freelancers = (data || []).map((f: any, i: number) => this.normalizeFreelancer(f, i));
        this.isLoading   = false;
      },
      error: (err) => {
        console.error('Error loading freelancers:', err);
        this.error     = 'Failed to load freelancers';
        this.isLoading = false;
        this.toastController.create({
          message: 'Erreur chargement freelancers',
          duration: 2000,
          color: 'danger',
        }).then(t => t.present());
      },
    });
  }

  private normalizeFreelancer(f: any, index = 0): any {
    const firstName = f.firstName || '';
    const lastName  = f.lastName  || '';
    return {
      ...f,
      id:          f._id,
      name:        `${firstName} ${lastName}`.trim() || 'Unknown',
      initials:    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?',
      avatarColor: this.avatarColors[index % this.avatarColors.length],
      domain:      f.domain     || 'Freelancer',
      domainKey:   (f.domain    || '').toLowerCase(),
      location:    f.location   || f.city || '—',
      rating:      f.rating     ?? '—',
      reviews:     f.reviews    ?? 0,
      bio:         f.bio        || '',
      skills:      Array.isArray(f.skills) ? f.skills : [],
      tjm:         f.tjm        || f.dailyRate || '—',
      completed:   f.completedProjects?.length ?? f.completed ?? 0,
    };
  }

  setDomain(value: string) {
    this.activeDomain = value;
    this.loadFreelancers(value !== 'all' ? value : undefined);
  }

  get filteredFreelancers() {
    let list = this.freelancers;
    if (this.activeDomain !== 'all') {
      list = list.filter(fl => fl.domainKey === this.activeDomain);
    }
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      list = list.filter(fl =>
        fl.name.toLowerCase().includes(q) ||
        fl.domain.toLowerCase().includes(q) ||
        fl.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  viewProfile(fl: any) {
    this.router.navigate(['/client/freelancers', fl.id]);
  }

  // ── Bouton Contact ──────────────────────────────────────────────────────
  contactFreelancer(fl: any) {
    this.messageService.startConversation(fl.id).subscribe({
      next: (res) => {
        this.router.navigate(['/client/messages'], {
          queryParams: { conversationId: res.conversationId },
        });
      },
      error: (err) => {
        console.error('Erreur création conversation:', err);
        this.toastController.create({
          message: 'Impossible de contacter ce freelancer',
          duration: 2000,
          color: 'danger',
        }).then(t => t.present());
      },
    });
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}