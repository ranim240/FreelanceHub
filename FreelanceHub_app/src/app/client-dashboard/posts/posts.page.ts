import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientPost } from '../../models/client-post.model';
import { DashboardService } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PostsPage {
  private dashboardService = inject(DashboardService);
  posts$: Observable<ClientPost[]> = this.dashboardService.getPosts();
}

