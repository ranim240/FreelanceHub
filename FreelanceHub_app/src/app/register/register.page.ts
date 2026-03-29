import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // 1. On ajoute l'import

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  currentStep: number = 1;
  selectedRole: 'freelancer' | 'client' = 'freelancer';
  selectedDomain: string = '';
  
  // 2. Ajout des variables pour le formulaire (étape 3)
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  

  // 3. On injecte HttpClient en plus de Router
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  setRole(role: 'freelancer' | 'client') {
    this.selectedRole = role;
  }



  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // 4. On met à jour la méthode register pour appeler Flask
  register() {
    const finalData = {
      role: this.selectedRole,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.firstName+this.lastName,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:5000/api/auth/register', finalData).subscribe({
      next: (res: any) => {
        console.log('Inscription réussie:', res);
        alert("Félicitations " + this.firstName + " ! " + res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur inscription:', err);
        alert("Erreur : " + (err.error?.error || 'Erreur serveur'));
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
