import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { Announcement } from '../models/announcement.model';

@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.page.html',
  styleUrls: ['./announcement-detail.page.scss'],
  standalone: false
})
export class AnnouncementDetailPage implements OnInit {
  announcement: Announcement | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnnouncement(id);
    } else {
      this.goBack();
    }
  }

  loadAnnouncement(id: string) {
    this.loading = true;
    this.homeService.getAnnouncement(id).subscribe({
      next: (data) => {
        this.announcement = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.goBack();
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  messageClient() {
    // Navigate to messages or open message modal
    this.router.navigate(['/client/messages']);
  }
}
