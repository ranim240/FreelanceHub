import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage {
  email = '';
  isSubmitting = false;
  message = '';
  isSuccess = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.email) {
      this.message = 'Please enter your email address';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    // Send password reset request to backend
    this.http.post('http://localhost:5000/forgot-password', { email: this.email })
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.message = res.message || 'Password reset link sent to your email';
          this.isSuccess = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message = err.error?.error || 'Failed to send reset link. Please try again.';
          this.isSuccess = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
