import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantCreationPageComponent } from './tenant-creation-page.component';

describe('TenantCreationPageComponent', () => {
  let component: TenantCreationPageComponent;
  let fixture: ComponentFixture<TenantCreationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantCreationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
