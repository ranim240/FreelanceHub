import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientPage } from './client.page';
import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  declarations: [ClientPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientRoutingModule
  ]
})
export class ClientPageModule {}
