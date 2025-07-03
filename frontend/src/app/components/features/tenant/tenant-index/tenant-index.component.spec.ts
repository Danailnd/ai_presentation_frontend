import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantIndexComponent } from './tenant-index.component';

describe('TenantIndexComponent', () => {
  let component: TenantIndexComponent;
  let fixture: ComponentFixture<TenantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
