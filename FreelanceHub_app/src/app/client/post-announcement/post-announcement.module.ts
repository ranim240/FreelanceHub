import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostAnnouncementPageRoutingModule } from './post-announcement-routing.module';

import { PostAnnouncementPage } from './post-announcement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostAnnouncementPageRoutingModule
  ],
  declarations: [PostAnnouncementPage]
})
export class PostAnnouncementPageModule {}
