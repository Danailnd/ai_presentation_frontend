import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantCommandsComponent } from './tenant-commands.component';

describe('TenantCommandsComponent', () => {
  let component: TenantCommandsComponent;
  let fixture: ComponentFixture<TenantCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantCommandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
