import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  selectedRole: 'freelancer' | 'client' = 'freelancer';
  email = '';
  password = '';

  constructor(private http: HttpClient,private router:Router) { }
    ngOnInit() {
    console.log('Page de login prête');
  }
  selectRole(role: 'freelancer' | 'client') {
    this.selectedRole = role;
  }

  onLogin() {
    console.log("Role sélectionné :", this.selectedRole);
    console.log("Email saisi :", this.email);
    console.log("Password saisi :", this.password);
    const body = { email: this.email, password: this.password, role: this.selectedRole };

    this.http.post('http://localhost:5000/login', body).subscribe({
      next: (res: any) => alert('Succès : ' + res.message),
      error: (err: any) => alert('Erreur : ' + (err.error?.error || 'Serveur injoignable'))
    });
  }
    goToRegister() {
    this.router.navigate(['/register']);
  }

  }


 


