import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchText = '';

  @Output() searchTriggered = new EventEmitter<string>();

  onSearch() {
    this.searchTriggered.emit(this.searchText);
  }

  clearSearch() {
    this.searchText = '';
    this.searchTriggered.emit('');
  }
}
