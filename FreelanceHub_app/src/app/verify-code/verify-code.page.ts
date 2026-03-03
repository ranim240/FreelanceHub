import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.page.html',
  styleUrls: ['./verify-code.page.scss'],
  standalone: false,
})
export class VerifyCodePage {
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  message = '';
  isSuccess = false;
  step: 'verify' | 'reset' = 'verify';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onVerifyCode() {
    if (!this.code) {
      this.message = 'Veuillez entrer le code de vérification';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.http.post('http://localhost:5000/api/auth/verify-code', { 
      email: this.email,
      code: this.code
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.verified) {
          this.step = 'reset';
          this.message = 'Code vérifié! Veuillez entrer votre nouveau mot de passe.';
          this.isSuccess = true;
        } else {
          this.message = res.message || 'Code vérifié!';
          this.isSuccess = true;
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.message = err.error?.error || 'Code de vérification incorrect';
        this.isSuccess = false;
      }
    });
  }

  onResetPassword() {
    if (!this.newPassword) {
      this.message = 'Veuillez entrer un nouveau mot de passe';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword.length < 6) {
      this.message = 'Le mot de passe doit contenir au moins 6 caractères';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.http.post('http://localhost:5000/api/auth/verify-code', { 
      email: this.email,
      code: this.code,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.message = res.message || 'Mot de passe réinitialisé avec succès!';
        this.isSuccess = true;
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.message = err.error?.error || 'Erreur lors de la réinitialisation du mot de passe';
        this.isSuccess = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/forgot-password']);
  }
}
