import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tenant-view-button-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tenant-view-button-bar.component.html',
  styleUrl: './tenant-view-button-bar.component.scss',
})
export class TenantViewButtonBarComponent {
  @Input() items: { label: string; icon: string }[] = [];
  @Input() activeLabel: string | null = null;
  @Output() itemSelected = new EventEmitter<string>();

  onSelect(label: string) {
    this.itemSelected.emit(label);
  }
}
