import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContractDetailPageRoutingModule } from './contract-detail-routing.module';
import { ContractDetailPage } from './contract-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ContractDetailPageRoutingModule],
  declarations: [ContractDetailPage]
})
export class ContractDetailPageModule {}
