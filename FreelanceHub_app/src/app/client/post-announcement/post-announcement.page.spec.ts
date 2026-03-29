import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostAnnouncementPage } from './post-announcement.page';

describe('PostAnnouncementPage', () => {
  let component: PostAnnouncementPage;
  let fixture: ComponentFixture<PostAnnouncementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAnnouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
