import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantPageComponent } from './tenant-main-page.component';

describe('NewBookTablePageComponent', () => {
  let component: TenantPageComponent;
  let fixture: ComponentFixture<TenantPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
