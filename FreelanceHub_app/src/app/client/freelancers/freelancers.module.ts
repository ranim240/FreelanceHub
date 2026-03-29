import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FreelancersPageRoutingModule } from './freelancers-routing.module';

import { FreelancersPage } from './freelancers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FreelancersPageRoutingModule
  ],
  declarations: [FreelancersPage]
})
export class FreelancersPageModule {}
