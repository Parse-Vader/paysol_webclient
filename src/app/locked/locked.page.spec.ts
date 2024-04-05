import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LockedPage } from './locked.page';

describe('LockedPage', () => {
  let component: LockedPage;
  let fixture: ComponentFixture<LockedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LockedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
