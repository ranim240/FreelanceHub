import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostAnnouncementPage } from './post-announcement.page';

const routes: Routes = [
  {
    path: '',
    component: PostAnnouncementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostAnnouncementPageRoutingModule {}
