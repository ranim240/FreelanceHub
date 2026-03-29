import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreelancersPage } from './freelancers.page';

describe('FreelancersPage', () => {
  let component: FreelancersPage;
  let fixture: ComponentFixture<FreelancersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
