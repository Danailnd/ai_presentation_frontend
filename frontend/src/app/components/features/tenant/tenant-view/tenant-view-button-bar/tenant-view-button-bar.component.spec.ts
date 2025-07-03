import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantViewButtonBarComponent } from './tenant-view-button-bar.component';

describe('TenantViewButtonBarComponent', () => {
  let component: TenantViewButtonBarComponent;
  let fixture: ComponentFixture<TenantViewButtonBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantViewButtonBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantViewButtonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
