import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

interface Announcement {
  id: number;
  clientName: string;
  clientInitials: string;
  postedAt: string;
  status: string;
  title: string;
  description: string;
  tags: string[];
  budget: string;
  deadline: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

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

  announcements: Announcement[] = [
    {
      id: 1, clientName: 'Ahmed Ben Ali', clientInitials: 'AB',
      postedAt: '2 hours ago', status: 'Open',
      title: 'E-commerce Mobile App Development',
      description: 'Looking for an Ionic/Angular developer to build a full mobile app with cart, payment and push notifications.',
      tags: ['Ionic', 'Angular', 'Firebase'], budget: '800 – 1200 DT', deadline: '30 days',
    },
    {
      id: 2, clientName: 'Sara Mansour', clientInitials: 'SM',
      postedAt: '5 hours ago', status: 'Open',
      title: 'Logo Design & Brand Identity',
      description: 'Need a designer to create a professional logo and complete brand guidelines for a FinTech startup.',
      tags: ['Logo', 'Figma', 'Branding'], budget: '300 – 500 DT', deadline: '10 days',
    },
    {
      id: 3, clientName: 'Karim Trabelsi', clientInitials: 'KT',
      postedAt: '1 day ago', status: 'Urgent',
      title: 'SEO Articles for Tech Blog',
      description: 'Looking for an experienced writer to produce 10 SEO-optimized articles on AI, cybersecurity and cloud topics.',
      tags: ['SEO', 'Writing', 'AI'], budget: '150 – 250 DT', deadline: '7 days',
    },
  ];

  categories: Category[] = [
    { id: 1, name: 'All',       icon: 'grid-outline',          active: true  },
    { id: 2, name: 'AI',        icon: 'hardware-chip-outline', active: false },
    { id: 3, name: 'Design',    icon: 'color-palette-outline', active: false },
    { id: 4, name: 'Dev',       icon: 'code-slash-outline',    active: false },
    { id: 5, name: 'Writing',   icon: 'pencil-outline',        active: false },
    { id: 6, name: 'Marketing', icon: 'megaphone-outline',     active: false },
  ];

  trendingGigs: TrendingGig[] = [];

  faqs: Faq[] = [
    {
      question: 'How do I become a freelancer on FreelanceHub?',
      answer: 'Create an account, choose the "Freelancer" role, complete your profile and submit it for review. An admin will approve it within 24–48 hours.',
      open: true,
    },
    {
      question: 'How do I post a project as a client?',
      answer: 'After signing up with the "Client" role, go to Announcements and click "New Offer". Fill in the title, description, budget and deadline.',
      open: false,
    },
    {
      question: 'How does the digital products Store work?',
      answer: 'The Store offers starter kits, source code, AI models and designs. After a simulated purchase, you can download the file directly to your device.',
      open: false,
    },
    {
      question: 'Are my payments secure?',
      answer: 'Yes, all transactions go through a secure payment system. Payment is only released once the delivery has been validated.',
      open: false,
    },
    {
      question: 'How do I contact a freelancer?',
      answer: 'From a Gig page or an announcement, click "Message" to open a direct conversation with the freelancer.',
      open: false,
    },
  ];

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.trendingGigs = products.map(p => ({ ...p, isFavorite: false }));
    });
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
  goToProfile():       void { console.log('Navigate to Profile'); /* this.router.navigate(['/profile']); */ }
  goToStore():         void { this.router.navigate(['/store']); }
  goToAnnouncements(): void { console.log('Navigate to Announcements'); /* this.router.navigate(['/announcements']); */ }
  goToMessages():      void { console.log('Messages'); }
  goToSearch():        void { this.router.navigate(['/store']); }

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