import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastController } from '@ionic/angular';

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
    { _id: '1', name: 'SEO Content Template Pack', seller: 'ContentPro', price: 80,  rating: '4.3' },
    { _id: '2', name: 'Brand Identity Mega Pack',  seller: 'CreativeHub', price: 120, rating: '4.4' },
    { _id: '3', name: 'React Dashboard UI Kit',    seller: 'DevStudio',   price: 60,  rating: '4.6' },
  ];

  cartItems: any[] = [];
  showCartModal = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private cartService: CartService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.todayDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day:     'numeric',
      month:   'long',
      year:    'numeric',
    });

    // Load user data
    const user = this.auth.currentUser;
    if (user) {
      this.clientName = user.firstName || 'Client';
      this.loadCart();
    }

    // Check payment status and cart modal request from URL
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        const user = this.auth.currentUser;
        if (user) {
          this.cartService.clearCart(user._id).subscribe({
            next: () => {
              this.cartItems = [];
              this.presentToast('Paiement réussi ! Votre panier a été vidé.', 'success');
            },
            error: (err) => console.error('Erreur vidage panier:', err)
          });
        }
      } else if (params['payment'] === 'cancelled') {
        this.presentToast('Paiement annulé.', 'warning');
      }

      if (params['showCart'] === 'true') {
        this.openCart();
      }
    });
  }

  // ── Cart Methods ─────────────────────────────
  openCart() {
    this.showCartModal = true;
    this.loadCart();
  }

  closeCart() {
    this.showCartModal = false;
  }

  loadCart() {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.getCart(user._id).subscribe({
        next: (items) => this.cartItems = items,
        error: (err) => console.error('Erreur chargement panier:', err)
      });
    }
  }

  removeFromCart(productId: string) {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.removeFromCart(user._id, productId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(item => item._id !== productId);
          this.presentToast('Produit retiré du panier.', 'success');
        },
        error: (err) => console.error('Erreur suppression panier:', err)
      });
    }
  }

  checkout() {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.checkout(user._id).subscribe({
        next: (res) => {
          if (res.url) {
            window.location.href = res.url; // Redirect to Stripe
          }
        },
        error: (err) => {
          console.error('Erreur checkout:', err);
          this.presentToast('Erreur lors de la redirection vers le paiement.', 'danger');
        }
      });
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  // ── Navigation ─────────────────────────────
  goTo(page: string) {
    const target = page.startsWith('client') ? `/${page}` : `/client/${page}`;
    this.router.navigate([target]);
  }

  goToProductDetail(id: string) {
    this.router.navigate(['/product-detail', id]);
  }

  navigate(page: string) {
    this.menuOpen = false;
    const target = page.startsWith('client') ? `/${page}` : `/client/${page}`;
    setTimeout(() => this.router.navigate([target]), 300);
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