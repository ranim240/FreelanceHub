import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContractWorkspacePageRoutingModule } from './contract-workspace-routing.module';
import { ContractWorkspacePage } from './contract-workspace.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ContractWorkspacePageRoutingModule],
  declarations: [ContractWorkspacePage]
})
export class ContractWorkspacePageModule {}
