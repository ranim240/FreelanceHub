import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-store',
  templateUrl: 'store.page.html',
  styleUrls: ['store.page.scss'],
  standalone: false
})
export class StorePage implements OnInit {

  // ── All static products ──────────────────────────────────────
  private allProducts: Product[] = [];

  // ── State ────────────────────────────────────────────────────
  filteredProducts: Product[] = [];
  selectedCategory = 'All';
  searchQuery = '';
  activeFilter = 'All';

  categories = ['All', 'Dev', 'AI', 'Design', 'Writing', 'Marketing'];
  filters    = ['All', 'Price ↑', 'Price ↓', 'Top Rated', 'Newest'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;

      // Read query params for category and search
      this.route.queryParams.subscribe(params => {
        this.selectedCategory = params['category'] || 'All';
        this.searchQuery = params['search'] || '';
        this.applyFilters();
      });
    });
  }

  // ── Filter products by category + search ─────────────────────
  applyFilters(): void {
    let result = [...this.allProducts];

    // Category filter
    if (this.selectedCategory !== 'All') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort filter
    if (this.activeFilter === 'Price ↑')  result.sort((a, b) => a.price - b.price);
    if (this.activeFilter === 'Price ↓')  result.sort((a, b) => b.price - a.price);
    if (this.activeFilter === 'Top Rated') result.sort((a, b) => b.rating - a.rating);

    this.filteredProducts = result;
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value || '';
    this.applyFilters();
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  selectFilter(f: string): void {
    this.activeFilter = f;
    this.applyFilters();
  }

  // ── Navigate to product detail ────────────────────────────────
  openProduct(product: Product): void {
    this.router.navigate(['/product-detail', product._id]);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  // ── Star array helper for template ───────────────────────────
  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}