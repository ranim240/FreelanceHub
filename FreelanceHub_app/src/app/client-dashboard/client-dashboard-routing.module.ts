import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client-dashboard.page').then(m => m.ClientDashboardPage),
    children: [
      {
        path: 'posts',
        loadChildren: () => import('./posts/posts.module').then(m => m.PostsPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: 'panier',
        loadChildren: () => import('./panier/panier.module').then(m => m.PanierPageModule)
      },
      {
        path: 'publier',
        loadChildren: () => import('./publier/publier.module').then(m => m.PublierPageModule)
      },
      {
        path: 'parametres',
        loadChildren: () => import('./parametres/parametres.module').then(m => m.ParametresPageModule)
      },
      {
        path: '',
        redirectTo: '/client-dashboard/posts',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ClientDashboardRoutingModule {}

