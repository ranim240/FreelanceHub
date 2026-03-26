import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];
  
  // Modal state
  isModalOpen = false;
  isEditing = false;
  currentCategoryId = '';
  
  // Form data
  catName = '';
  catIcon = '';

  constructor(
    private adminService: AdminService, 
    private router: Router, 
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.adminService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur loading categories:', err)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentCategoryId = '';
    this.catName = '';
    this.catIcon = '';
    this.isModalOpen = true;
  }

  openEditModal(cat: any) {
    this.isEditing = true;
    this.currentCategoryId = cat._id;
    this.catName = cat.name;
    this.catIcon = cat.icon;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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

  saveCategory() {
    if (!this.catName || !this.catIcon) return;

    if (this.isEditing) {
      this.adminService.updateCategory(this.currentCategoryId, this.catName, this.catIcon).subscribe({
        next: () => {
          this.showToast('Category updated successfully');
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    } else {
      this.adminService.createCategory(this.catName, this.catIcon).subscribe({
        next: () => {
          this.showToast('Category created successfully');
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to permanently delete this category?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => {
          this.showToast('Category deleted successfully');
          this.loadCategories();
        },
        error: (err) => this.showToast('Error: ' + err.error?.error, 'danger')
      });
    }
  }

  goTo(page: string) {
    this.navCtrl.navigateRoot(['/admin', page]);
  }
}
