import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantContentOverviewComponent } from './tenant-overview.component';

describe('TenantContentOverviewComponent', () => {
  let component: TenantContentOverviewComponent;
  let fixture: ComponentFixture<TenantContentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantContentOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantContentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
