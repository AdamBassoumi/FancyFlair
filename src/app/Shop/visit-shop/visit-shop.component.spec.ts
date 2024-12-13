import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitShopComponent } from './visit-shop.component';

describe('VisitShopComponent', () => {
  let component: VisitShopComponent;
  let fixture: ComponentFixture<VisitShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitShopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
