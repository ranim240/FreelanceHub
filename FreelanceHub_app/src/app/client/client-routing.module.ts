import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientPage } from './client.page';

const routes: Routes = [
  {
    path: '',
    component: ClientPage,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'announcements',
        loadChildren: () => import('./announcements/announcements.module').then( m => m.AnnouncementsPageModule)
      },
      {
        path: 'post-announcement',
        loadChildren: () => import('./post-announcement/post-announcement.module').then( m => m.PostAnnouncementPageModule)
      },
      {
        path: 'freelancers',
        loadChildren: () => import('./freelancers/freelancers.module').then( m => m.FreelancersPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
      },
      {
        path: 'contracts',
        loadChildren: () => import('./contracts/contracts.module').then( m => m.ContractsPageModule)
      },
      {
        path: 'contract-detail/:id',
        loadChildren: () => import('./contract-detail/contract-detail.module').then( m => m.ContractDetailPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
