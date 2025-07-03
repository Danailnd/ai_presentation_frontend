import { Component, EventEmitter, Output } from '@angular/core';
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

  sidebarItems = [
    { label: 'Overview', icon: 'dashboard' },
    { label: 'Details', icon: 'info' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Logs', icon: 'list' },
  ];

  onSelect(item: string) {
    this.itemSelected.emit(item);
  }
}
