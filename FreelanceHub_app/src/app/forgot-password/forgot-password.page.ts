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
      this.message = 'Veuillez entrer votre adresse email';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    // Send password reset request to backend
    this.http.post('http://localhost:5000/api/auth/forgot-password', { email: this.email })
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.message = res.message || 'Un code de vérification a été envoyé à votre adresse email';
          this.isSuccess = true;
          // Navigate to verify-code page after successful send
          setTimeout(() => {
            this.router.navigate(['/verify-code'], { queryParams: { email: this.email } });
          }, 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message = err.error?.error || 'Échec de l\'envoi du code. Veuillez réessayer.';
          this.isSuccess = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
