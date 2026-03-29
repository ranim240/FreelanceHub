import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  
  searchText = '';
  statusFilter = '';

  selectedProduct: any = null;
  isProductModalOpen = false;

  constructor(
    private adminService: AdminService, 
    private router: Router, 
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur loading products:', err)
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const prodStatus = p.moderationStatus || p.status || 'pending';
      const matchSearch = !this.searchText || 
        p.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchStatus = !this.statusFilter || prodStatus === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  changeStatus(productId: string, status: string) {
    const actionText = status === 'approved' ? 'approve' : 'reject';
    if (confirm(`Are you sure you want to ${actionText} this product?`)) {
      this.adminService.updateProductStatus(productId, status).subscribe({
        next: () => {
          this.showToast(`Product ${status} successfully`);
          this.loadProducts();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.showToast('Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating || 0)).fill(0);
  }

  setFilter(filter: string) {
    this.statusFilter = filter;
    this.applyFilters();
  }

  openProductModal(product: any) {
    this.selectedProduct = product;
    this.isProductModalOpen = true;
  }

  closeProductModal() {
    this.isProductModalOpen = false;
    setTimeout(() => this.selectedProduct = null, 300);
  }

  goTo(page: string) {
    this.navCtrl.navigateRoot(['/admin', page]);
  }
}
