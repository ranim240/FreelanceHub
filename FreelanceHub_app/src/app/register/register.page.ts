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
  selectedRole: 'freelance' | 'client' = 'freelance';
  selectedDomain: string = '';
  
  // 2. Ajout des variables pour le formulaire (étape 3)
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  
  domains = [
    { key: 'dev',       label: 'Développement', icon: 'code-slash-outline'    },
    { key: 'design',    label: 'Design',         icon: 'color-palette-outline' },
    { key: 'marketing', label: 'Marketing',      icon: 'megaphone-outline'     },
    { key: 'redaction', label: 'Rédaction',      icon: 'pencil-outline'        },
    { key: 'video',     label: 'Vidéo',          icon: 'videocam-outline'      },
    { key: 'data',      label: 'Data / BI',      icon: 'stats-chart-outline'   },
  ];

  // 3. On injecte HttpClient en plus de Router
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  setRole(role: 'freelance' | 'client') {
    this.selectedRole = role;
  }

  setDomain(key: string) {
    this.selectedDomain = key;
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
      domain: this.selectedDomain,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
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
