import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-tooltip-button',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './tooltip.button.component.html',
  styleUrl: './tooltip.button.component.scss',
})
export class TooltipButtonComponent {
  @Input() tooltipText = 'Default tooltip text'; // Tooltip text
  @Input() tooltipPosition: 'left' | 'right' | 'above' | 'below' = 'below';
}
