import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

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
  currentUser = { name: 'Ahmed Ben Ali', initials: 'AB', avatar: '' };

  // Search — navigates to store on submit
  searchQuery = '';

  announcements: Announcement[] = [];

  categories: Category[] = [];

  trendingGigs: TrendingGig[] = [];

  faqs: Faq[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    // Load products
    this.productService.getFeaturedProducts().subscribe(products => {
      this.trendingGigs = products.map(p => ({ ...p, isFavorite: false }));
    });
    // Load announcements
    this.homeService.getAnnouncements().subscribe(anns => this.announcements = anns);
    // Load categories
    this.homeService.getCategories().subscribe(cats => this.categories = cats);
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
  goToLogin():         void { console.log('Navigate to Login'); /* this.router.navigate(['/login']); */ }
  goToSignup():        void { console.log('Navigate to Signup'); /* this.router.navigate(['/register']); */ }
  goToProfile():       void { this.router.navigate(['/profile-view']);} 
  goToStore():         void { this.router.navigate(['/store']); }

  goToAnnouncements(): void { console.log('Navigate to Announcements'); /* this.router.navigate(['/announcements']); */ }
  goToMessages(): void { console.log('Messages'); }
  goToSearch(): void { this.router.navigate(['/store']); }

  // ── Announcements ─────────────────────────────────────────────
  openAnnouncement(ann: Announcement): void { console.log('Open:', ann.title); }

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