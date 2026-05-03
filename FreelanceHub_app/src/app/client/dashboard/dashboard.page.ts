;;;;import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  menuOpen   = false;
  clientName = 'Client';
  todayDate  = '';
  isLoading  = true;

  stats = { announcements: 0, freelancers: 0, products: 0, messages: 0 };

  myAnnouncements: any[] = [];
  topFreelancers:  any[] = [];
  recentProducts:  any[] = [];
  cartItems:       any[] = [];
  showCartModal        = false;

  private avatarColors = [
    '#6366F1','#8B5CF6','#EC4899','#14B8A6','#F59E0B','#3B82F6','#10B981',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private cartService: CartService,
    private clientService: ClientService,
    private productService: ProductService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.todayDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const user = this.auth.currentUser;
    if (user) {
      this.clientName = user.firstName || 'Client';
      this.loadDashboardData(user._id);
      this.loadCart();
    }
    this.route.queryParams.subscribe(params => {
      const u = this.auth.currentUser;
      if (params['payment'] === 'success' && u) {
        this.cartService.clearCart(u._id).subscribe({
          next: () => { this.cartItems = []; this.presentToast('Paiement reussi!', 'success'); },
          error: (err) => console.error(err)
        });
      } else if (params['payment'] === 'cancelled') {
        this.presentToast('Paiement annule.', 'warning');
      }
      if (params['showCart'] === 'true') this.openCart();
    });
  }

  loadDashboardData(userId: string) {
    this.isLoading = true;

    this.clientService.getDashboardData(userId).subscribe({
      next: (data) => {
        this.stats           = { ...this.stats, ...data.stats };
        this.myAnnouncements = (data.myAnnouncements || []).map((a: any) => this.normalizeAnnouncement(a));
        this.topFreelancers  = (data.topFreelancers  || []).map((f: any, i: number) => this.normalizeFreelancer(f, i));
        this.isLoading       = false;
        this.loadFreelancersCount(); // Fix: get real freelancer count
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.isLoading = false;
        this.loadFallbackData(userId);
      }
    });

    this.productService.getFeaturedProducts().subscribe({
      next:  (p) => this.recentProducts = (p || []).slice(0, 3).map((x: any) => this.normalizeProduct(x)),
      error: ()  => this.productService.getProducts().subscribe({
        next: (p) => this.recentProducts = (p || []).slice(0, 3).map((x: any) => this.normalizeProduct(x)),
        error: (err) => console.error('Products error:', err)
      })
    });
  }

  // Fix: stats.freelancers = 0 car backend ne retourne pas ce count
  loadFreelancersCount() {
    this.clientService.getFreelancers().subscribe({
      next: (fls) => this.stats = { ...this.stats, freelancers: (fls || []).length },
      error: (err) => console.error('Freelancers count error:', err)
    });
  }

  loadFallbackData(userId: string) {
    this.clientService.getAnnouncements(userId).subscribe({
      next: (anns) => {
        const list = anns || [];
        this.myAnnouncements     = list.slice(0, 2).map((a: any) => this.normalizeAnnouncement(a));
        this.stats.announcements = list.length;
      },
      error: (err) => console.error('Fallback announcements error:', err)
    });
    this.clientService.getFreelancers().subscribe({
      next: (fls) => {
        const list = fls || [];
        this.topFreelancers    = list.slice(0, 5).map((f: any, i: number) => this.normalizeFreelancer(f, i));
        this.stats.freelancers = list.length;
      },
      error: (err) => console.error('Fallback freelancers error:', err)
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating || 0));
  }

  private normalizeAnnouncement(a: any): any {
    return {
      ...a,
      initials:    (a.title || '?').charAt(0).toUpperCase(),
      title:       a.title       || 'Untitled',
      description: a.description || '',
      status:      a.status      || 'open',
      tags:        a.tags        || [],
      budget:      a.budget      ? `${a.budget} DT` : 'N/A',
      deadline:    a.deadline    ? new Date(a.deadline).toLocaleDateString('fr-FR') : 'N/A',
      timeAgo:     a.createdAt   ? this.timeAgo(a.createdAt) : '',
    };
  }

  private normalizeFreelancer(f: any, i: number = 0): any {
    const first = (f.firstName || '?').charAt(0).toUpperCase();
    const last  = (f.lastName  || '').charAt(0).toUpperCase();
    return {
      ...f,
      id:          f._id,
      initials:    `${first}${last}`,
      avatarUrl:   f.avatarUrl || '',
      avatarColor: this.avatarColors[i % this.avatarColors.length],
      name:        `${f.firstName || ''} ${f.lastName || ''}`.trim() || 'Unknown',
      domain:      f.domain || 'Freelancer',
      rating:      f.rating ?? 0,
      projects:    f.totalProjects ?? 0,
      bio:         f.bio ? f.bio.substring(0, 60) + '...' : '',
      location:    f.location || ''
    };
  }

  contactFreelancer(fl: any) {
    this.router.navigate(['/client/messages'], { queryParams: { freelancerId: fl.id, name: fl.name } });
  }

  private normalizeProduct(p: any): any {
    return {
      ...p,
      image: p.image,
      name:   p.name       || p.title  || 'Product',
      seller: p.sellerName || p.seller || '',
      price:  p.price      ?? 0,
      rating: p.rating     ?? '—',
    };
  }

  private timeAgo(dateStr: string): string {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins  > 0) return `${mins}m ago`;
    return 'just now';
  }

  openCart()  { this.showCartModal = true; this.loadCart(); }
  closeCart() { this.showCartModal = false; }

  loadCart() {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.getCart(user._id).subscribe({
        next:  (items) => this.cartItems = items || [],
        error: (err)   => console.error('Panier error:', err)
      });
    }
  }

  removeFromCart(productId: string) {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.removeFromCart(user._id, productId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(i => i._id !== productId);
          this.presentToast('Produit retire du panier.', 'success');
        },
        error: (err) => console.error(err)
      });
    }
  }

  checkout() {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.checkout(user._id).subscribe({
        next:  (res) => { if (res.url) window.location.href = res.url; },
        error: (err) => {
          console.error(err);
          this.presentToast('Erreur paiement.', 'danger');
        }
      });
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 3000, color, position: 'top' });
    toast.present();
  }

  goTo(page: string) {
    const target = page.startsWith('client') ? `/${page}` : `/client/${page}`;
    this.router.navigate([target]);
  }

  goToProductDetail(id: string) { this.router.navigate(['/product-detail', id]); }

  navigate(page: string) {
    this.menuOpen = false;
    const target  = page.startsWith('client') ? `/${page}` : `/client/${page}`;
    setTimeout(() => this.router.navigate([target]), 300);
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  logout() {
    this.menuOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}