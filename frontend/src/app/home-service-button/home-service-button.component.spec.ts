import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeServiceButtonComponent } from './home-service-button.component';

describe('HomeServiceButtonComponent', () => {
  let component: HomeServiceButtonComponent;
  let fixture: ComponentFixture<HomeServiceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeServiceButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeServiceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
