import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatRippleModule, MatTooltipModule],
})
export class ButtonComponent {
  /**
   * Text label displayed inside the button.
   */
  @Input() text = '';

  /**
   * (Optional) Material icon name shown before the text.
   * Example: 'add', 'delete', 'check'.
   */
  @Input() icon?: string;

  /**
   * Visual style of the button. Affects background and text colors.
   * - `primary`: Main action button
   * - `regular`: Neutral button
   * - `warning`: Destructive or risky action
   */
  @Input() type: 'primary' | 'regular' | 'warning' = 'regular';

  /**
   * Disables the button interaction and styles it accordingly.
   */
  @Input() disabled = false;

  /**
   * Emits when the button is clicked (unless disabled).
   */
  @Output() clicked = new EventEmitter<void>();

  /**
   * Internal click handler that emits the `clicked` output.
   */
  handleClick(): void {
    this.clicked.emit();
  }
}
