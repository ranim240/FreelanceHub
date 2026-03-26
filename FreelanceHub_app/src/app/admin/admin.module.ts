import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminPage } from './admin.page';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [AdminPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule
  ]
})
export class AdminPageModule {}
