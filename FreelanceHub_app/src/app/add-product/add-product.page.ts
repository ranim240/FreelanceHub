import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: false
})
export class AddProductPage {
  newProduct = {
    title: '',
    category: '',
    price: null as number | null,
    description: '',
    techStackInput: '', // will be split by comma
  };

  loading = false;

  constructor(
    private productService: ProductService,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  goBack() {
    this.router.navigate(['/home']);
  }

  async showToast(message: string, color: string) {
    const t = await this.toastCtrl.create({
      message, color, duration: 3000, position: 'bottom'
    });
    t.present();
  }

  submitProduct() {
    if (!this.newProduct.title || !this.newProduct.category || !this.newProduct.price || !this.newProduct.description) {
      this.showToast('Please fill all required fields.', 'warning');
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      this.showToast('You must be logged in.', 'danger');
      return;
    }

    this.loading = true;

    // Process tech stack (split by comma and trim)
    const techStack = this.newProduct.techStackInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: this.newProduct.title,
      category: this.newProduct.category,
      price: this.newProduct.price,
      description: this.newProduct.description,
      techStack: techStack,
      author: `${user.firstName} ${user.lastName}`,
      authorInitials: `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`,
      image: 'assets/images/products/placeholder.png' // Default placeholder
    };

    this.productService.createProduct(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.showToast('Product submitted! Waiting for Admin approval.', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.showToast('Failed to submit product.', 'danger');
      }
    });
  }
}
