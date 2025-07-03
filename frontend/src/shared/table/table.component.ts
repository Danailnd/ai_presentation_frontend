import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatInputModule } from '@angular/material/input';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatRippleModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    SearchComponent,
    MatSortModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: {
    key: string;
    label: string;
    customCell?: (value: any, row?: any) => string;
  }[] = [];
  @Input() onClick: (selectedObject: any) => void = () => {};
  @Input() maxHeight: number = 400;
  @Input() selectedRow: string = '';
  @Input() headerRowType: 'filled' | 'light' = 'filled';
  @Input() maxRowLetterCount: number = 40;
  @Input() tableSize: 'normal' | 'dense' = 'normal';
  @Input() scrollPosition: number | null = null;
  @Input() search: string[] | '*' | null = null;
  @Input() filters: any = null;

  searchText: string = '';
  isSelectable: boolean = true;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('tableContainer') tableContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild(MatSort) sort!: MatSort;

  private defaultNoOpFunction = () => {};

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const isNoOpFunction =
      this.onClick.toString() === this.defaultNoOpFunction.toString();
    this.isSelectable = !isNoOpFunction;

    this.dataSource.data = this.data;

    this.dataSource.filterPredicate = (row, filter: string) => {
      const lowerFilter = filter.trim().toLowerCase();

      if (!this.search || this.search === '*') {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerFilter)
        );
      }

      return (this.search as string[]).some((key) => {
        const value = row[key];
        return value && String(value).toLowerCase().includes(lowerFilter);
      });
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    if (this.scrollPosition != null && this.tableContainerRef) {
      setTimeout(() => {
        this.tableContainerRef.nativeElement.scrollTop = this.scrollPosition!;
      });
    }
  }

  get displayedColumns(): string[] {
    return this.columns.map((col) => col.key);
  }

  handleRowClick(element: any): void {
    if (this.isSelectable && typeof this.onClick === 'function') {
      this.onClick(element);
    }
  }

  isRowSelected(row: any): boolean {
    if (!this.selectedRow) return false;
    return row.id === this.selectedRow;
  }

  truncate(value: string): string {
    if (this.maxRowLetterCount && value?.length > this.maxRowLetterCount) {
      return value.substring(0, this.maxRowLetterCount) + '...';
    }
    return value;
  }

  public getScrollPosition(): number {
    return this.tableContainerRef?.nativeElement.scrollTop ?? 0;
  }

  get hasFilters(): boolean {
    return this.filters !== null;
  }

  onSearchTriggered(searchTerm: string) {
    this.dataSource.filter = searchTerm.trim().toLowerCase();
  }

  getCellDisplayValue(
    row: any,
    column: { key: string; customCell?: (value: any, row?: any) => string }
  ): SafeHtml {
    const value = row[column.key];
    const result = column.customCell
      ? column.customCell(value, row)
      : this.truncate(String(value));
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

  getTooltip(row: any, column: { key: string }): string {
    const value = row[column.key];
    return String(value);
  }
}
