import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-home-service-button',
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatRippleModule],
  templateUrl: './home-service-button.component.html',
  styleUrl: './home-service-button.component.scss',
})
export class HomeServiceButtonComponent {
  @Input() icon: string = '';
  @Input() text: string = '';
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
