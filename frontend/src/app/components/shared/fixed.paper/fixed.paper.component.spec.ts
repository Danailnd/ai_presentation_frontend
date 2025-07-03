import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPaperComponent } from './fixed.paper.component';

describe('PaperComponent', () => {
  let component: FixedPaperComponent;
  let fixture: ComponentFixture<FixedPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedPaperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
