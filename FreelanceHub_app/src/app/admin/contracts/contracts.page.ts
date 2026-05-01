import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-admin-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
  standalone: false
})
export class ContractsPage implements OnInit {
  stats: any = null;
  contracts: any[] = [];
  loading = true;
  activeFilter = '';

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.loadStats();
    this.loadContracts();
  }

  loadStats() {
    this.contractService.getEscrowStats().subscribe({
      next: (data) => this.stats = data,
      error: () => {}
    });
  }

  loadContracts(status?: string) {
    this.loading = true;
    this.activeFilter = status || '';
    this.contractService.getAllContracts(status).subscribe({
      next: (data) => { this.contracts = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filterBy(status: string) {
    if (this.activeFilter === status) {
      this.loadContracts(); // clear filter
    } else {
      this.loadContracts(status);
    }
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
      pending: 'Pending', funded: 'Funded', in_progress: 'In Progress',
      delivered: 'Delivered', completed: 'Completed'
    };
    return labels[status] || status;
  }
}
