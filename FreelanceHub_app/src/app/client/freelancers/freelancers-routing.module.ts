import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreelancersPage } from './freelancers.page';

const routes: Routes = [
  {
    path: '',
    component: FreelancersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreelancersPageRoutingModule {}
