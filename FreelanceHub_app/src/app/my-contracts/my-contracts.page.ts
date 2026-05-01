import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-my-contracts',
  templateUrl: './my-contracts.page.html',
  styleUrls: ['./my-contracts.page.scss'],
  standalone: false
})
export class MyContractsPage implements OnInit {
  contracts: any[] = [];
  loading = true;

  constructor(
    private contractService: ContractService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() { this.loadContracts(); }

  loadContracts() {
    const user = this.auth.currentUser;
    if (!user) return;
    this.loading = true;
    this.contractService.getFreelancerContracts(user._id).subscribe({
      next: (data) => { this.contracts = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get activeCount() { return this.contracts.filter(c => ['funded', 'in_progress'].includes(c.status)).length; }
  get totalEarned() { return this.contracts.filter(c => c.status === 'completed').reduce((s: number, c: any) => s + c.freelancerAmount, 0); }
  get pendingPayout() { return this.contracts.filter(c => c.status === 'delivered').reduce((s: number, c: any) => s + c.freelancerAmount, 0); }

  openWorkspace(id: string) {
    this.router.navigate(['/contract-workspace', id]);
  }

  goBack() { this.router.navigate(['/home']); }

  getStatusColor(status: string): string {
    const c: any = { pending: '#F59E0B', funded: '#3B82F6', in_progress: '#8B5CF6', delivered: '#10B981', completed: '#059669' };
    return c[status] || '#94A3B8';
  }

  getStatusLabel(status: string): string {
    const l: any = { pending: 'Awaiting Payment', funded: 'Funded', in_progress: 'In Progress', delivered: 'Delivered', completed: 'Completed' };
    return l[status] || status;
  }
}
