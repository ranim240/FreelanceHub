import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-contract-workspace',
  templateUrl: './contract-workspace.page.html',
  styleUrls: ['./contract-workspace.page.scss'],
  standalone: false
})
export class ContractWorkspacePage implements OnInit {
  contract: any = null;
  loading = true;
  contractId = '';
  showAddTask = false;
  showAddMilestone = false;
  activeTab = 'gantt';

  newTask = { title: '', milestoneId: '', startDate: '', endDate: '' };
  newMilestone = { title: '', description: '', deadline: '' };

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
  }

  loadContract() {
    this.loading = true;
    this.contractService.getContract(this.contractId).subscribe({
      next: (data) => { this.contract = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // ═══════════════════════════════════════════════════
  //  GANTT CHART HELPERS
  // ═══════════════════════════════════════════════════

  get ganttStart(): Date {
    if (!this.contract?.tasks?.length) return new Date();
    const dates = this.contract.tasks.map((t: any) => new Date(t.startDate).getTime());
    return new Date(Math.min(...dates));
  }

  get ganttEnd(): Date {
    if (!this.contract?.tasks?.length) return new Date();
    const dates = this.contract.tasks.map((t: any) => new Date(t.endDate).getTime());
    const end = new Date(Math.max(...dates));
    end.setDate(end.getDate() + 1);
    return end;
  }

  get totalDays(): number {
    return Math.max(1, Math.ceil((this.ganttEnd.getTime() - this.ganttStart.getTime()) / (1000 * 60 * 60 * 24)));
  }

  get ganttWeeks(): string[] {
    const weeks: string[] = [];
    const current = new Date(this.ganttStart);
    while (current < this.ganttEnd) {
      weeks.push(current.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
      current.setDate(current.getDate() + 7);
    }
    return weeks;
  }

  getBarLeft(task: any): number {
    const start = new Date(task.startDate).getTime();
    const offset = start - this.ganttStart.getTime();
    return Math.max(0, (offset / (1000 * 60 * 60 * 24)) / this.totalDays * 100);
  }

  getBarWidth(task: any): number {
    const start = new Date(task.startDate).getTime();
    const end = new Date(task.endDate).getTime();
    const duration = (end - start) / (1000 * 60 * 60 * 24);
    return Math.max(2, (duration / this.totalDays) * 100);
  }

  getMilestoneName(id: string): string {
    const m = this.contract?.milestones?.find((ms: any) => ms.id === id);
    return m ? m.title : '';
  }

  // ═══════════════════════════════════════════════════
  //  TASK ACTIONS
  // ═══════════════════════════════════════════════════

  cycleTaskStatus(task: any) {
    const order = ['todo', 'in_progress', 'done'];
    const idx = order.indexOf(task.status);
    task.status = order[(idx + 1) % order.length];
    task.progress = task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : 0;
    this.saveTasks();
  }

  addTask() {
    if (!this.newTask.title || !this.newTask.startDate || !this.newTask.endDate) {
      this.toast('Fill all task fields', 'warning');
      return;
    }
    const tasks = this.contract.tasks || [];
    tasks.push({
      id: 't' + (tasks.length + 1) + '_' + Date.now(),
      milestoneId: this.newTask.milestoneId,
      title: this.newTask.title,
      startDate: this.newTask.startDate,
      endDate: this.newTask.endDate,
      progress: 0,
      status: 'todo'
    });
    this.contract.tasks = tasks;
    this.saveTasks();
    this.newTask = { title: '', milestoneId: '', startDate: '', endDate: '' };
    this.showAddTask = false;
  }

  removeTask(taskId: string) {
    this.contract.tasks = this.contract.tasks.filter((t: any) => t.id !== taskId);
    this.saveTasks();
  }

  saveTasks() {
    this.contractService.updateTasks(this.contractId, this.contract.tasks).subscribe({
      next: () => this.toast('Tasks saved', 'success'),
      error: () => this.toast('Error saving tasks', 'danger')
    });
  }

  // ═══════════════════════════════════════════════════
  //  MILESTONE ACTIONS
  // ═══════════════════════════════════════════════════

  cycleMilestoneStatus(ms: any) {
    const order = ['pending', 'in_progress', 'completed'];
    const idx = order.indexOf(ms.status);
    ms.status = order[(idx + 1) % order.length];
    this.saveMilestones();
  }

  addMilestone() {
    if (!this.newMilestone.title || !this.newMilestone.deadline) {
      this.toast('Fill required milestone fields', 'warning');
      return;
    }
    const msList = this.contract.milestones || [];
    msList.push({
      id: 'm' + (msList.length + 1) + '_' + Date.now(),
      title: this.newMilestone.title,
      description: this.newMilestone.description,
      deadline: this.newMilestone.deadline,
      status: 'pending'
    });
    this.contract.milestones = msList;
    this.saveMilestones();
    this.newMilestone = { title: '', description: '', deadline: '' };
    this.showAddMilestone = false;
  }

  saveMilestones() {
    this.contractService.updateMilestones(this.contractId, this.contract.milestones).subscribe({
      next: () => this.toast('Milestones updated', 'success'),
      error: () => this.toast('Error updating milestones', 'danger')
    });
  }

  // ═══════════════════════════════════════════════════
  //  DELIVER
  // ═══════════════════════════════════════════════════

  async deliverProject() {
    const alert = await this.alertCtrl.create({
      header: 'Deliver Project',
      message: 'Mark this project as delivered? The client will be able to validate and release your payment.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Deliver',
          handler: () => {
            this.contractService.deliverContract(this.contractId).subscribe({
              next: () => { this.toast('Project delivered!', 'success'); this.loadContract(); },
              error: () => this.toast('Error delivering', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // ═══════════════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════════════

  getStatusColor(status: string): string {
    const c: any = { pending: '#F59E0B', funded: '#3B82F6', in_progress: '#8B5CF6', delivered: '#10B981', completed: '#059669', todo: '#94A3B8', done: '#10B981' };
    return c[status] || '#94A3B8';
  }

  goBack() { this.router.navigate(['/my-contracts']); }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    t.present();
  }
}
