import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedShopsDropdownComponent } from './followed-shops-dropdown.component';

describe('FollowedShopsDropdownComponent', () => {
  let component: FollowedShopsDropdownComponent;
  let fixture: ComponentFixture<FollowedShopsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowedShopsDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowedShopsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
