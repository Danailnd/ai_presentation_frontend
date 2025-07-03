import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-default-paper',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRippleModule],
  templateUrl: './default.paper.component.html',
  styleUrl: './default.paper.component.scss',
})
export class DefaultPaperComponent {
  /**
   * Enables vertical scroll inside the content container.
   */
  @Input() enableScroll = true;

  /**
   * Makes the card clickable and enables ripple effect.
   */
  @Input() clickable = false;

  /**
   * Removes default padding inside the card.
   */
  @Input() noPadding = false;
}
