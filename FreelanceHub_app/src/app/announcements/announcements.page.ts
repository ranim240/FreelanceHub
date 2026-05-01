import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { Announcement } from '../models/announcement.model';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
  standalone: false
})
export class AnnouncementsPage implements OnInit {
  announcements: Announcement[] = [];
  loading = true;

  constructor(
    private homeService: HomeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.loading = true;
    this.homeService.getAnnouncements().subscribe({
      next: (data) => {
        // Reverse array to show newest first, assuming backend sends them in insertion order
        this.announcements = data.reverse();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openAnnouncement(ann: Announcement) {
    this.router.navigate(['/announcement-detail', ann._id]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
