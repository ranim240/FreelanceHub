import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyContractsPage } from './my-contracts.page';

const routes: Routes = [{ path: '', component: MyContractsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyContractsPageRoutingModule {}
