import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

interface Gig {
  id: number;
  title: string;
  image: string;
  rating: number;
  isFavorite: boolean;
}

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  // ── Announcements : project offers posted by clients ─────────
  announcements: Announcement[] = [
    {
      id: 1,
      clientName: 'Ahmed Ben Ali',
      clientInitials: 'AB',
      postedAt: '2 hours ago',
      status: 'Open',
      title: 'E-commerce Mobile App Development',
      description: 'Looking for an Ionic/Angular developer to build a full mobile app with cart, payment and push notifications.',
      tags: ['Ionic', 'Angular', 'Firebase'],
      budget: '800 – 1200 DT',
      deadline: '30 days',
    },
    {
      id: 2,
      clientName: 'Sara Mansour',
      clientInitials: 'SM',
      postedAt: '5 hours ago',
      status: 'Open',
      title: 'Logo Design & Brand Identity',
      description: 'Need a designer to create a professional logo and complete brand guidelines for a FinTech startup.',
      tags: ['Logo', 'Figma', 'Branding'],
      budget: '300 – 500 DT',
      deadline: '10 days',
    },
    {
      id: 3,
      clientName: 'Karim Trabelsi',
      clientInitials: 'KT',
      postedAt: '1 day ago',
      status: 'Urgent',
      title: 'SEO Articles for Tech Blog',
      description: 'Looking for an experienced writer to produce 10 SEO-optimized articles on AI, cybersecurity and cloud topics.',
      tags: ['SEO', 'Writing', 'AI'],
      budget: '150 – 250 DT',
      deadline: '7 days',
    },
  ];

  // ── Product Categories ───────────────────────────────────────
  categories: Category[] = [
    { id: 1, name: 'All',       icon: 'grid-outline',           active: true  },
    { id: 2, name: 'AI',        icon: 'hardware-chip-outline',  active: false },
    { id: 3, name: 'Design',    icon: 'color-palette-outline',  active: false },
    { id: 4, name: 'Dev',       icon: 'code-slash-outline',     active: false },
    { id: 5, name: 'Writing',   icon: 'pencil-outline',         active: false },
    { id: 6, name: 'Marketing', icon: 'megaphone-outline',      active: false },
  ];

  // ── Trending Gigs ────────────────────────────────────────────
  trendingGigs: Gig[] = [
    {
      id: 1,
      title: 'Logo Design',
      image: 'https://picsum.photos/seed/logo/260/160',
      rating: 4.5,
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Mobile App',
      image: 'https://picsum.photos/seed/app/260/160',
      rating: 3.9,
      isFavorite: false,
    },
    {
      id: 3,
      title: 'Article Writing',
      image: 'https://picsum.photos/seed/write/260/160',
      rating: 4.2,
      isFavorite: false,
    },
    {
      id: 4,
      title: 'AI Model',
      image: 'https://picsum.photos/seed/ai/260/160',
      rating: 4.8,
      isFavorite: false,
    },
  ];

  // ── FAQ ──────────────────────────────────────────────────────
  faqs: Faq[] = [
    {
      question: 'How do I become a freelancer on FreelanceHub?',
      answer: 'Create an account, choose the "Freelancer" role, complete your profile (bio, skills, CV) and submit it for review. An admin will approve it within 24–48 hours.',
      open: true,
    },
    {
      question: 'How do I post a project as a client?',
      answer: 'After signing up with the "Client" role, go to the "Announcements" section and click "New Offer". Fill in the title, description, budget and deadline.',
      open: false,
    },
    {
      question: 'How does the digital products Store work?',
      answer: 'The Store offers starter kits, source code, AI models and designs. After a simulated purchase, you can download the file directly to your device.',
      open: false,
    },
    {
      question: 'Are my payments secure?',
      answer: 'Yes, all transactions go through a secure payment system. For freelance services, payment is only released once the delivery has been validated.',
      open: false,
    },
    {
      question: 'How do I contact a freelancer?',
      answer: 'From a service (Gig) page or an announcement, click "Message" to open a direct conversation with the freelancer.',
      open: false,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // ── Open announcement detail ──────────────────────────────────
  openAnnouncement(ann: Announcement): void {
    // TODO: this.router.navigate(['/announcement-detail', ann.id]);
    console.log('Announcement selected:', ann.title);
  }

  // ── Message a client ─────────────────────────────────────────
  messageClient(event: Event, ann: Announcement): void {
    event.stopPropagation();
    // TODO: this.router.navigate(['/messages', ann.id]);
    console.log('Message to:', ann.clientName);
  }

  // ── Select a category ────────────────────────────────────────
  selectCategory(selected: Category): void {
    this.categories.forEach(cat => (cat.active = false));
    selected.active = true;
    // TODO: filter gigs by category when backend is ready
  }

  // ── Open gig detail ──────────────────────────────────────────
  openGig(gig: Gig): void {
    // TODO: this.router.navigate(['/gig-detail', gig.id]);
    console.log('Gig selected:', gig.title);
  }

  // ── Toggle favorite ──────────────────────────────────────────
  toggleFavorite(event: Event, gig: Gig): void {
    event.stopPropagation();
    gig.isFavorite = !gig.isFavorite;
  }

  // ── Toggle FAQ item ──────────────────────────────────────────
  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}