import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false
})
export class ReportsPage implements OnInit {
  isModalOpen = false;
  
  // New Report Form
  reportType: 'user' | 'product' | 'announcement' | 'general' = 'general';
  targetName = '';
  reason: string = '';
  description = '';

  reasons = [
    { value: 'arnaque', label: 'Scam / Fraud' },
    { value: 'spam', label: 'Spam' },
    { value: 'vol', label: 'Property Theft' },
    { value: 'contenu_inapproprie', label: 'Inappropriate Content' },
    { value: 'autre', label: 'Other' }
  ];

  constructor(
    private adminService: AdminService,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {}

  openReportModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.reportType = 'general';
    this.targetName = '';
    this.reason = '';
    this.description = '';
  }

  submitReport() {
    const user = this.auth.currentUser;
    if (!user) return;

    const reportData = {
      reportedBy: {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      },
      targetType: this.reportType,
      targetName: this.targetName,
      reason: this.reason,
      description: this.description
    };

    this.adminService.createReport(reportData).subscribe({
      next: () => {
        this.showToast('Your report has been submitted successfully.');
        this.closeModal();
      },
      error: (err) => {
        this.showToast('An error occurred while submitting the report.', 'danger');
      }
    });
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  goBack() {
    this.location.back();
  }

  navigate(path: string) {
    this.router.navigate(['/' + path]);
  }
}
