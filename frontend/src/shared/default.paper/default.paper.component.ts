import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [CommonModule, MatCardModule, MatRippleModule],
  selector: 'app-default-paper',
  templateUrl: './default.paper.component.html',
  styleUrl: './default.paper.component.scss',
  standalone: true,
})
export class DefaultPaperComponent {
  @Input() enableScroll: boolean = true;
  @Input() clickable: boolean = false;
  @Input() noPadding: boolean = false;
}
