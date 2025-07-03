import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantContentComponent } from './tenant-content.component';

describe('TenantContentComponent', () => {
  let component: TenantContentComponent;
  let fixture: ComponentFixture<TenantContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
