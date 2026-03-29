import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Message } from '../../models/message.model';
import { DashboardService } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MessagesPage {
  private dashboardService = inject(DashboardService);
  messages$: Observable<Message[]> = this.dashboardService.getMessages();
}

