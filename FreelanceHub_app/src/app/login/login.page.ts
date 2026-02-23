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
   email = '';
  password = '';

  constructor(private http: HttpClient,private router:Router) { }
    ngOnInit() {
    console.log('Page de login prête');
  }
    onLogin() {
    console.log("Email saisi :", this.email);
    console.log("Password saisi :", this.password);
    const body = { email: this.email, password: this.password };

    this.http.post('http://localhost:5000/login', body).subscribe({
      next: (res: any) => alert('Succès : ' + res.message),
      error: (err: any) => alert('Erreur : ' + (err.error?.error || 'Serveur injoignable'))
    });
  }
    goToRegister() {
    this.router.navigate(['/register']);
  }

  }


 


