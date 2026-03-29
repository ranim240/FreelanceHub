import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    { label: 'All',      value: 'all'      },
    { label: 'Design',   value: 'design'   },
    { label: 'Dev',      value: 'dev'      },
    { label: 'Writing',  value: 'writing'  },
    { label: 'Marketing',value: 'marketing'},
  ];

  products = [
    { id: 1, name: 'SEO Content Template Pack',  seller: 'ContentPro',  price: 80,  rating: '4.3', reviewCount: 21, category: 'writing',  status: 'Approved' },
    { id: 2, name: 'Brand Identity Mega Pack',    seller: 'CreativeHub', price: 120, rating: '4.4', reviewCount: 15, category: 'design',   status: 'Approved' },
    { id: 3, name: 'React Dashboard UI Kit',      seller: 'DevStudio',   price: 60,  rating: '4.6', reviewCount: 38, category: 'dev',      status: 'Approved' },
    { id: 4, name: 'Social Media Post Templates', seller: 'DesignLab',   price: 45,  rating: '4.2', reviewCount: 9,  category: 'marketing',status: 'Approved' },
    { id: 5, name: 'Mobile App Wireframe Kit',    seller: 'UXPro',       price: 90,  rating: '4.7', reviewCount: 27, category: 'design',   status: 'Approved' },
    { id: 6, name: 'Email Marketing Templates',   seller: 'MailCraft',   price: 35,  rating: '4.1', reviewCount: 44, category: 'marketing',status: 'Pending'  },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: this.http.get('/api/products').subscribe(...)
  }

  setFilter(value: string) {
    this.activeFilter = value;
  }

  get filteredProducts() {
    return this.products.filter(p => {
      const matchFilter = this.activeFilter === 'all' || p.category === this.activeFilter;
      const matchSearch = !this.searchText
        || p.name.toLowerCase().includes(this.searchText.toLowerCase())
        || p.seller.toLowerCase().includes(this.searchText.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  viewProduct(p: any) {
    this.router.navigate(['/client/products', p.id]);
  }

  addToCart(p: any) {
    this.cartCount++;
    // TODO: ajouter au panier
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}