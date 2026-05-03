import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ToastController } from '@ionic/angular';

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

  // Avatar colors palette — assigned by index
  private avatarColors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6',
    '#F59E0B', '#3B82F6', '#10B981', '#EF4444',
  ];

  freelancers: any[] = [];

  constructor(
    private router: Router,
    private clientService: ClientService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadFreelancers();
  }

  loadFreelancers(domain?: string) {
    this.isLoading = true;
    this.error = '';
    this.clientService.getFreelancers(domain).subscribe({
      next: (data) => {
        // ✅ Normalize every freelancer to match what the HTML template expects
        this.freelancers = (data || []).map((f: any, i: number) => this.normalizeFreelancer(f, i));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading freelancers:', err);
        this.error = 'Failed to load freelancers';
        this.isLoading = false;
        this.toastController.create({
          message: 'Erreur chargement freelances',
          duration: 2000,
          color: 'danger'
        }).then(toast => toast.present());
      }
    });
  }

  // ── Normalize MongoDB doc → template-ready object ───────────────────
  private normalizeFreelancer(f: any, index: number = 0): any {
    const firstName = f.firstName || '';
    const lastName  = f.lastName  || '';
    const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
    const name      = `${firstName} ${lastName}`.trim() || 'Unknown';
    const domain    = f.domain || 'Freelancer';
    const domainKey = domain.toLowerCase();

    return {
      ...f,
      id:          f._id,
      name,
      initials,
      avatarColor: this.avatarColors[index % this.avatarColors.length],
      domain,
      domainKey,
      location:    f.location   || f.city || '—',
      rating:      f.rating     ?? '—',
      reviews:     f.reviews    ?? 0,
      bio:         f.bio        || '',
      skills:      Array.isArray(f.skills) ? f.skills : [],   // ✅ never undefined
      tjm:         f.tjm        || f.dailyRate || '—',
      completed:   f.completedProjects?.length ?? f.completed ?? 0,
    };
  }

  setDomain(value: string) {
    this.activeDomain = value;
    this.loadFreelancers(value !== 'all' ? value : undefined);
  }

  get filteredFreelancers() {
    let filtered = this.freelancers;

    if (this.activeDomain !== 'all') {
      filtered = filtered.filter(fl => fl.domainKey === this.activeDomain);
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      filtered = filtered.filter(fl =>
        fl.name.toLowerCase().includes(q) ||
        fl.domain.toLowerCase().includes(q) ||
        fl.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  viewProfile(fl: any) {
    this.router.navigate(['/client/freelancers', fl.id]);
  }

  contactFreelancer(fl: any) {
    this.router.navigate(['/client/messages'], {
      queryParams: { freelancerId: fl.id, name: fl.name }
    });
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}