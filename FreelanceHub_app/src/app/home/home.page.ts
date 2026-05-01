import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { AuthService, User } from '../services/auth.service';
import { MenuController } from '@ionic/angular';

import { Announcement } from '../models/announcement.model';
import { Category } from '../models/category.model';
import { Faq } from '../models/faq.model';
import { HomeService } from '../services/home.service';

type TrendingGig = Product & { isFavorite: boolean };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  isLoggedIn = false;
  currentUser: { name?: string; initials?: string; avatar?: string } = { name: '', initials: '', avatar: '' };

  // Search — navigates to store on submit
  searchQuery = '';

  announcements: Announcement[] = [];

  categories: Category[] = [];

  trendingGigs: TrendingGig[] = [];

  faqs: Faq[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private homeService: HomeService,
    private auth: AuthService,
    private menuCtrl: MenuController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'main-menu');
    this.menuCtrl.enable(false, 'client-menu');
  }


  ngOnInit(): void {
    // observe authentication state
    this.auth.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.currentUser.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        if (user.avatarUrl) {
          this.currentUser.avatar = user.avatarUrl;
        } else {
          const initials = ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase();
          this.currentUser.initials = initials;
        }
      } else {
        this.currentUser = { name: '', initials: '', avatar: '' };
      }
    });

    // Load products
    this.productService.getFeaturedProducts().subscribe(products => {
      this.trendingGigs = products.map(p => ({ ...p, isFavorite: false }));
    });
    // Load announcements
    this.homeService.getAnnouncements().subscribe(anns => this.announcements = anns);
    // Load categories
    this.homeService.getCategories().subscribe(cats => {
      // Mettre 'All' en premier si elle existe
      const allIndex = cats.findIndex(c => c.name.toLowerCase() === 'all');
      if (allIndex > -1) {
        const allCat = cats.splice(allIndex, 1)[0];
        cats.unshift(allCat);
      }
      this.categories = cats;
    });
    // Load FAQs
    this.homeService.getFaqs().subscribe(faqs => this.faqs = faqs);
  }

  // ── Search → navigate to store with keyword ───────────────────
  onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    if (!q) {
      this.router.navigate(['/store']);
      return;
    }
    this.router.navigate(['/store'], { queryParams: { search: q } });
  }

  // ── Navigation ────────────────────────────────────────────────
  goToLogin(): void { this.router.navigate(['/login']); }
  goToSignup(): void { this.router.navigate(['/register']); }
  goToProfile():       void {
    if (this.auth.currentUser?.role === 'client') {
      this.router.navigate(['/client/dashboard']);
    } else {
      this.router.navigate(['/profile-view']);
    }
  } 
  goToStore():         void { this.router.navigate(['/store']); }
  goToAnnouncements(): void {
    this.router.navigate(['/announcements']);
  }
  goToMessages(): void {
    this.router.navigate(['/client/messages']);
  }

  goToReports(): void {
    this.router.navigate(['/client/reports']);
  }

  goToSearch(): void { this.router.navigate(['/store']); }

  // ── Announcements ─────────────────────────────────────────────
  openAnnouncement(ann: Announcement): void {
    this.router.navigate(['/announcement-detail', ann._id]);
  }

  messageClient(event: Event, ann: Announcement): void {
    event.stopPropagation();
    console.log('Message:', ann.clientName);
  }

  // ── Categories ────────────────────────────────────────────────
  selectCategory(selected: Category): void {
    this.categories.forEach(c => (c.active = false));
    selected.active = true;
    this.router.navigate(['/store'], { queryParams: { category: selected.name } });
  }

  // ── Gigs — uses storeProductId to open the correct product ───
  openGig(gig: Product): void {
    this.router.navigate(['/product-detail', gig._id]);
  }

  toggleFavorite(event: Event, gig: TrendingGig): void {
    event.stopPropagation();
    gig.isFavorite = !gig.isFavorite;
    // In a real app, you would call a service to save this user preference.
  }

  // ── FAQ ───────────────────────────────────────────────────────
  toggleFaq(i: number): void { this.faqs[i].open = !this.faqs[i].open; }
}