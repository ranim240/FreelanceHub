import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {

  searchText   = '';
  activeFilter = 'all';
  cartCount    = 0;

  filters = [
    { label: 'All',      value: 'all',       icon: 'apps-outline' },
    { label: 'Design',   value: 'design',    icon: 'brush-outline' },
    { label: 'Dev',      value: 'dev',       icon: 'code-slash-outline' },
    { label: 'Writing',  value: 'writing',   icon: 'pencil-outline' },
    { label: 'Marketing',value: 'marketing', icon: 'megaphone-outline' },
  ];

  products: any[] = [];

  constructor(
    public  router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error('Erreur chargement produits:', err)
    });
  }

  setFilter(value: string) {
    this.activeFilter = value;
  }

  get filteredProducts() {
    return this.products.filter(p => {
      const matchFilter = this.activeFilter === 'all' || p.category === this.activeFilter;
      const matchSearch = !this.searchText
        || (p.title && p.title.toLowerCase().includes(this.searchText.toLowerCase()))
        || (p.author && p.author.toLowerCase().includes(this.searchText.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }

  viewProduct(p: any) {
    this.router.navigate(['/product-detail', p._id]);
  }

  addToCart(p: any) {
    const user = this.auth.currentUser;
    if (!user) {
      this.presentToast('Veuillez vous connecter pour ajouter au panier.', 'warning');
      return;
    }

    this.cartService.addToCart(user._id, p._id).subscribe({
      next: () => {
        this.cartCount++;
        this.presentToast('Produit ajouté au panier !', 'success');
      },
      error: (err) => {
        console.error(err);
        this.presentToast('Erreur lors de l\'ajout au panier.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}