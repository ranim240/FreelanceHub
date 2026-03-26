import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardPage],
  imports: [CommonModule, IonicModule, DashboardRoutingModule]
})
export class DashboardPageModule {}
