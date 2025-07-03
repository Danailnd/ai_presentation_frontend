import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [CommonModule, MatCardModule],
  selector: 'app-fixed-paper',
  templateUrl: './fixed.paper.component.html',
  styleUrl: './fixed.paper.component.scss',
  standalone: true,
})
export class FixedPaperComponent {
  @Input() position = 'center';
}
