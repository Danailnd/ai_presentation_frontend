import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [MatIconModule, CommonModule, MatRippleModule],
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() icon?: string;
  @Input() type: 'primary' | 'regular' | 'warning' = 'regular';

  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }
}
