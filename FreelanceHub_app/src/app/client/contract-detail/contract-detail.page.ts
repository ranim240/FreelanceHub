import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.page.html',
  styleUrls: ['./contract-detail.page.scss'],
  standalone: false
})
export class ContractDetailPage implements OnInit {
  contract: any = null;
  loading = true;
  contractId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.contractId = this.route.snapshot.paramMap.get('id') || '';
    this.loadContract();

    // Handle Stripe return
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        this.contractService.fundContract(this.contractId).subscribe({
          next: () => {
            this.toast('Payment successful! Funds are now in escrow.', 'success');
            this.loadContract();
          },
          error: () => this.toast('Payment recorded but escrow update failed.', 'warning')
        });
      } else if (params['payment'] === 'cancelled') {
        this.toast('Payment cancelled.', 'warning');
      }
    });
  }

  loadContract() {
    this.loading = true;
    this.contractService.getContract(this.contractId).subscribe({
      next: (data) => { this.contract = data; this.loading = false; },
      error: () => { this.loading = false; this.toast('Contract not found', 'danger'); }
    });
  }

  // ── Pay via Stripe ─────────────────────────────────
  payContract() {
    this.contractService.payContract(this.contractId).subscribe({
      next: (res) => {
        if (res.url) { window.location.href = res.url; }
      },
      error: (err) => this.toast('Payment error: ' + (err.error?.error || 'Unknown'), 'danger')
    });
  }

  // ── Validate & Release Payment ─────────────────────
  async validateContract() {
    const alert = await this.alertCtrl.create({
      header: 'Validate Project',
      message: `Are you sure? This will release <strong>${this.contract.freelancerAmount} ${this.contract.currency}</strong> to the freelancer.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Validate & Release',
          handler: () => {
            this.contractService.validateContract(this.contractId).subscribe({
              next: (res) => {
                this.toast(res.message, 'success');
                this.loadContract();
              },
              error: (err) => this.toast('Validation error', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Helpers ────────────────────────────────────────
  getStatusColor(status: string): string {
    const colors: any = {
      pending: '#F59E0B', funded: '#3B82F6', in_progress: '#8B5CF6',
      delivered: '#10B981', completed: '#059669'
    };
    return colors[status] || '#94A3B8';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'Pending Payment', funded: 'Funded (Escrow)',
      in_progress: 'In Progress', delivered: 'Delivered',
      completed: 'Completed'
    };
    return labels[status] || status;
  }

  getMilestoneIcon(status: string): string {
    if (status === 'completed') return 'checkmark-circle';
    if (status === 'in_progress') return 'ellipse';
    return 'ellipse-outline';
  }

  goBack() { this.router.navigate(['/client/contracts']); }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    t.present();
  }
}
