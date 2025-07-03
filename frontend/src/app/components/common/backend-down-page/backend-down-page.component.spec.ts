import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendDownPageComponent } from './backend-down-page.component';

describe('BackendDownPageComponent', () => {
  let component: BackendDownPageComponent;
  let fixture: ComponentFixture<BackendDownPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendDownPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendDownPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
