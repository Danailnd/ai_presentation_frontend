import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPaperComponent } from './default.paper.component';

describe('PaperComponent', () => {
  let component: DefaultPaperComponent;
  let fixture: ComponentFixture<DefaultPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultPaperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
