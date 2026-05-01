import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
  standalone: false
})
export class ContractsPage implements OnInit {
  contracts: any[] = [];
  freelancers: any[] = [];
  loading = true;
  showNewForm = false;

  // New contract form
  newContract = {
    title: '',
    description: '',
    freelancerId: '',
    amount: null as number | null
  };

  constructor(
    private contractService: ContractService,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadContracts();
    this.loadFreelancers();
  }

  loadContracts() {
    const user = this.auth.currentUser;
    if (!user) return;
    this.loading = true;
    this.contractService.getClientContracts(user._id).subscribe({
      next: (data) => { this.contracts = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadFreelancers() {
    this.contractService.getFreelancersList().subscribe({
      next: (data) => this.freelancers = data,
      error: () => {}
    });
  }

  // ── Stats ──────────────────────────────────────────
  get activeCount() { return this.contracts.filter(c => ['funded', 'in_progress', 'delivered'].includes(c.status)).length; }
  get completedCount() { return this.contracts.filter(c => c.status === 'completed').length; }
  get totalSpent() { return this.contracts.filter(c => c.status !== 'pending').reduce((sum: number, c: any) => sum + c.amount, 0); }

  // ── Form ───────────────────────────────────────────
  openNewForm() { this.showNewForm = true; }
  closeNewForm() { this.showNewForm = false; }

  async submitContract() {
    const user = this.auth.currentUser;
    if (!user) return;

    if (!this.newContract.title || !this.newContract.freelancerId || !this.newContract.amount) {
      this.toast('Please fill all required fields', 'warning');
      return;
    }

    const payload = {
      clientId: user._id,
      freelancerId: this.newContract.freelancerId,
      title: this.newContract.title,
      description: this.newContract.description,
      amount: this.newContract.amount,
      milestones: [] // Empty milestones initially, to be filled by freelancer
    };

    this.contractService.createContract(payload).subscribe({
      next: (contract) => {
        this.toast('Contract created! Proceed to payment.', 'success');
        this.showNewForm = false;
        this.resetForm();
        this.loadContracts();
      },
      error: (err) => this.toast('Error creating contract', 'danger')
    });
  }

  resetForm() {
    this.newContract = {
      title: '', description: '', freelancerId: '',
      amount: null
    };
  }

  // ── Navigation ─────────────────────────────────────
  viewContract(id: string) {
    this.router.navigate(['/client/contract-detail', id]);
  }

  getMilestoneProgress(contract: any): number {
    const milestones = contract.milestones || [];
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m: any) => m.status === 'completed').length;
    return Math.round((completed / milestones.length) * 100);
  }

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

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    t.present();
  }
}
