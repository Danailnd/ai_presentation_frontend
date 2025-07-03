import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-tenant-sidebar',
  templateUrl: './tenant-sidebar.component.html',
  styleUrls: ['./tenant-sidebar.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatListModule],
})
export class TenantSidebarComponent {
  @Output() itemSelected = new EventEmitter<string>();
  @Input() activeLabel: string | null = null;
  @Input() items: { label: string; icon: string }[] = [];

  onSelect(label: string) {
    this.itemSelected.emit(label);
  }
}
