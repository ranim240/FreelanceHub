import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit, OnDestroy {
  private timeoutId: any;

  constructor(private router: Router, private navController: NavController) {}

  ngOnInit() {
    // Auto redirect to login after 2 seconds
    this.timeoutId = setTimeout(() => {
      this.goToLogin();
    }, 2000);
  }

  ngOnDestroy() {
    // Clean up timeout if user navigates away
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  skipSplash() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.goToLogin();
  }
}
