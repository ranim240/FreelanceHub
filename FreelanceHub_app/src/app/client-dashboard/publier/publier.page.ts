import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../models/project.model';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-publier',
  templateUrl: './publier.page.html',
  styleUrls: ['./publier.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PublierPage {
  private fb = inject(FormBuilder);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  projectForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    budget: ['', Validators.required],
    timeline: ['', Validators.required]
  });
  categories = ['Développement', 'Design', 'Marketing', 'Autres'];
  skills: string[] = [];

  addSkill(skill: string) {
    if (skill && !this.skills.includes(skill)) {
      this.skills.push(skill);
    }
  }

  onSkillEnter(skillInput: any) {
    this.addSkill(skillInput.value as string || '');
    skillInput.value = '';
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const project: Project = {
        ...this.projectForm.value,
        skills: this.skills
      };
      this.dashboardService.publishProject(project);
      this.presentToast('Projet publié !');
      this.router.navigate(['/client-dashboard/posts']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}

