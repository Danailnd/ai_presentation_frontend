import { Component, Input, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * A reusable icon button for copying a string to the clipboard,
 */
@Component({
  selector: 'app-copy-to-clipboard',
  standalone: true,
  imports: [MatTooltip, MatButtonModule, MatIconModule],
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss',
})
export class CopyToClipboardComponent {
  /**
   * The string value to copy to the clipboard.
   * If null or empty, the button does nothing on click.
   */
  @Input() value: string | null = null;

  /**
   * Tooltip text shown when hovering the button before copy.
   * Defaults to 'Copy'.
   */
  @Input() tooltipCopy = 'Copy to Clipboard';

  /**
   * Tooltip text shown immediately after copying.
   * Defaults to 'Copied'.
   */
  @Input() tooltipCopied = 'Copied';

  /**
   * Position of the tooltip relative to the icon button.
   * Defaults to 'above'.
   */
  @Input() tooltipPosition: 'above' | 'below' | 'left' | 'right' = 'above';

  /**
   * Accessible label for screen readers and keyboard navigation.
   * Passed to `aria-label`.
   */
  @Input() ariaLabel = 'Copy';

  /**
   * Tracks whether the tooltip is showing the "Copied" message.
   */
  copied = false;

  /**
   * Tracks whether the user is currently hovering over the button.
   */
  hovering = false;

  /**
   * Reference to the Angular Material tooltip instance for manual control.
   */
  @ViewChild(MatTooltip, { static: true }) tooltip!: MatTooltip;

  /**
   * Handles mouse enter to manually show the tooltip.
   */
  onMouseEnter() {
    this.hovering = true;
    this.tooltip.show();
  }

  /**
   * Handles mouse leave to hide the tooltip and reset the copied state.
   */
  onMouseLeave() {
    this.hovering = false;
    this.tooltip.hide();
    setTimeout(() => {
      this.copied = false;
    }, 150);
  }

  /**
   * Copies the value to the clipboard and shows the "Copied" tooltip.
   * Does nothing if `value` is null or empty.
   */
  copyToClipboard() {
    if (this.value) {
      navigator.clipboard.writeText(this.value).then(() => {
        this.copied = true;
        this.tooltip.message = this.tooltipCopied;
        this.tooltip.show();
      });
    }
  }

  /**
   * Resolves the tooltip text based on current copied state.
   */
  get currentTooltip(): string {
    return this.copied ? this.tooltipCopied : this.tooltipCopy;
  }
}
