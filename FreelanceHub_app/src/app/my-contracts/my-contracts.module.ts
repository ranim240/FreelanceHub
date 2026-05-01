import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyContractsPageRoutingModule } from './my-contracts-routing.module';
import { MyContractsPage } from './my-contracts.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MyContractsPageRoutingModule],
  declarations: [MyContractsPage]
})
export class MyContractsPageModule {}
