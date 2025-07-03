import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

import { SearchComponent } from '../search/search.component';
import { TableColumn } from '../../../core/models/table.column';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { CopyToClipboardComponent } from '../copy-to-clipboard/copy-to-clipboard.component';

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
    MatCheckboxModule,
    MatSelectModule,
    MatBadgeModule,
    MatChipsModule,
    CopyToClipboardComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T extends { id?: string }>
  implements OnInit, AfterViewInit
{
  private readonly defaultNoOp: (selectedObject: T) => void = () => undefined;
  /** Columns to display in the table. */
  @Input() columns: TableColumn<T>[] = [];

  /** Max number of characters to display per cell before truncating. */
  @Input() maxRowLetterCount = 40;

  /** Table row density: 'normal' or 'dense'. */
  @Input() tableSize: 'normal' | 'dense' = 'normal';

  /** Type of header row appearance: 'filled' or 'light'. */
  @Input() headerRowType: 'filled' | 'light' = 'filled';

  /** If true makes the table more phone view friendly by:
   * - Reducing header column height
   * - Reducing search field size
   * - Removing filter chips
   */
  @Input() phoneViewMode = false;

  /** Max height (px) of the table container. */
  @Input() maxHeight = 400;

  // === Behavior & Interaction ===

  /** Row click handler. If not provided, clicking rows has no effect. */
  @Input() onClick: (selectedObject: T) => void = this.defaultNoOp;

  /** ID of the row that should appear visually selected. */
  @Input() selectedRow = '';

  /** Enables row expansion mode. Provided column name is dispayed by default, the rest of the fields are hidden until expanded */
  @Input() expandableRows: string | null = null;

  /** Enables checkbox multi-selection mode. */
  @Input() multiSelect = false;

  /** Scroll position to restore in the table container. */
  @Input() scrollPosition: number | null = null;

  // === Search & Filter ===

  /** Searchable fields. Use '*' to apply to all fields. */
  @Input() search: string[] | '*' | null = null;

  /** Filterable fields. Use '*' to apply to all fields. */
  @Input() filters: string[] | '*' | null = null;

  // === Outputs ===

  /** Emits the currently selected rows (only in multi-select mode). */
  @Output() selectedRowsChanged = new EventEmitter<Set<T>>();

  // === ViewChild Refs ===

  @ViewChild('tableContainer') tableContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild(MatSort) sort!: MatSort;

  // === Internal State ===

  searchText = '';
  isSelectable = true;
  dataSource = new MatTableDataSource<T>();
  selectedRowIds: Set<string> = new Set<string>();
  expandedElement: T | null = null;
  filtersState: Record<string, string> = {};

  private _data: T[] = [];

  /** The table data. Setting this triggers selection emit. */
  @Input()
  set data(value: T[]) {
    this._data = value;
    this.dataSource.data = value;

    setTimeout(() => {
      this.emitSelectedRows();
    });
  }
  get data(): T[] {
    return this._data;
  }

  constructor(private dialog: MatDialog) {}

  // =======================
  // Lifecycle Hooks
  // =======================

  ngOnInit() {
    this.isSelectable = this.onClick.toString() !== this.defaultNoOp.toString();
    this.dataSource.data = this.data;
    this.dataSource.filterPredicate = (row, filter: string) => {
      let parsedFilter: { searchText: string; filters: Record<string, string> };
      try {
        parsedFilter = JSON.parse(filter);
      } catch {
        return true;
      }
      const { searchText, filters } = parsedFilter;
      const matchesSearch =
        !this.search || this.search === '*'
          ? Object.values(row).some((value) =>
              String(value ?? '')
                .toLowerCase()
                .includes(searchText)
            )
          : (this.search as string[]).some((key) =>
              String(row[key as keyof T] ?? '')
                .toLowerCase()
                .includes(searchText)
            );
      const matchesFilters = Object.entries(filters).every(
        ([key, selected]) => {
          if (!selected || selected === 'ALL') return true;
          const column = this.columns.find((col) => col.key === key);
          const rowValue = row[key as keyof T];
          const valueToCompare = column?.filterLabel
            ? column.filterLabel(rowValue)
            : String(rowValue);
          return valueToCompare === selected;
        }
      );
      return matchesSearch && matchesFilters;
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

  // =======================
  // Getters
  // =======================

  get displayedColumns(): string[] {
    const base = this.multiSelect ? ['select'] : [];
    const mainColumns = this.expandableRows
      ? [this.expandableRows]
      : this.columns.map((col) => col.key as string);
    return this.hasOnClickAction
      ? [...base, ...mainColumns, 'action']
      : [...base, ...mainColumns];
  }

  get columnsWithoutExpanded(): TableColumn<T>[] {
    return this.columns.filter((col) => col.key !== this.expandableRows);
  }

  get isExpandedRow() {
    return (element: T) => this.expandedElement === element;
  }

  get isRowSelected() {
    return (row: T) => !!this.selectedRow && row.id === this.selectedRow;
  }

  get allRowsSelected(): boolean {
    const filteredRows = this.dataSource.filteredData;
    return (
      filteredRows.length > 0 &&
      filteredRows.every((row) => row.id && this.selectedRowIds.has(row.id))
    );
  }

  get hasOnClickAction(): boolean {
    return (
      this.onClick.toString() !== this.defaultNoOp.toString() &&
      !!this.expandableRows
    );
  }

  get activeFilterCount(): number {
    return Object.values(this.filtersState).filter(
      (value) => value && value !== 'ALL'
    ).length;
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  get activeFilterEntries() {
    return Object.entries(this.filtersState)
      .filter(([, value]) => value && value !== 'ALL') // fixed unused `_`
      .map(([key, value]) => {
        const column = this.columns.find((c) => String(c.key) === key);
        return { key, value, label: column?.label ?? key };
      });
  }

  get showNoDataMessage(): boolean {
    return this.dataSource.filteredData.length === 0;
  }

  // =======================
  // Utility Functions
  // =======================

  public getScrollPosition(): number {
    return this.tableContainerRef?.nativeElement.scrollTop ?? 0;
  }

  toggleExpand(element: T) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  handleRowClick(element: T): void {
    if (this.isSelectable) {
      this.onClick(element);
    }
  }

  truncate(value: string): string {
    return this.maxRowLetterCount && value?.length > this.maxRowLetterCount
      ? value.substring(0, this.maxRowLetterCount) + '...'
      : value;
  }

  asString(value: keyof T): string {
    return String(value);
  }

  isRowInSelection(row: T): boolean {
    return row.id ? this.selectedRowIds.has(row.id) : false;
  }

  // =======================
  // Selection
  // =======================

  toggleAllRows(): void {
    const filteredRows = this.dataSource.filteredData;

    if (this.allRowsSelected) {
      filteredRows.forEach((row) => {
        if (row.id) {
          this.selectedRowIds.delete(row.id);
        }
      });
    } else {
      filteredRows.forEach((row) => {
        if (row.id) {
          this.selectedRowIds.add(row.id);
        }
      });
    }

    this.emitSelectedRows();
  }

  toggleRowSelection(row: T): void {
    if (row.id) {
      if (this.selectedRowIds.has(row.id)) {
        this.selectedRowIds.delete(row.id);
      } else {
        this.selectedRowIds.add(row.id);
      }
      this.emitSelectedRows();
    }
  }

  private emitSelectedRows(): void {
    const selected = new Set(
      this.data.filter((row) => row.id && this.selectedRowIds.has(row.id))
    );
    this.selectedRowsChanged.emit(selected);
  }

  // =======================
  // Filtering
  // =======================

  onSearchTriggered(searchTerm: string) {
    this.searchText = searchTerm.trim().toLowerCase();
    this.triggerFilter();
  }

  triggerFilter() {
    this.dataSource.filter = JSON.stringify({
      searchText: this.searchText.trim().toLowerCase(),
      filters: this.filtersState,
    });

    const visibleIds = new Set(
      this.dataSource.filteredData.map((row) => row.id).filter(Boolean)
    );
    for (const id of Array.from(this.selectedRowIds)) {
      if (!visibleIds.has(id)) {
        this.selectedRowIds.delete(id);
      }
    }

    this.emitSelectedRows();
  }

  onFilterChange(key: string, value: string) {
    this.filtersState[key] = value;
    this.triggerFilter();
  }

  removeFilter(key: string): void {
    delete this.filtersState[key];
    this.triggerFilter();
  }

  getColumnUniqueValues(columnKey: keyof T): string[] {
    const column = this.columns.find((col) => col.key === columnKey);
    const values = new Set<string>();
    this.data.forEach((row) => {
      const rawValue = row[columnKey];
      const label = column?.filterLabel
        ? column.filterLabel(rawValue)
        : String(rawValue);
      values.add(label);
    });
    return Array.from(values);
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      restoreFocus: false,
      data: {
        columns: this.columns
          .filter(
            (col) =>
              this.filters === '*' ||
              (Array.isArray(this.filters) &&
                this.filters.includes(String(col.key)))
          )
          .map(({ key, label }) => ({
            key: String(key),
            label,
          })),

        currentFilters: this.filtersState,
        getColumnValues: (key: string) =>
          this.getColumnUniqueValues(key as keyof T),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filtersState = result;
        this.triggerFilter();
      }
    });
  }

  // =======================
  // Tooltip
  // =======================

  getTooltip(row: T, column: TableColumn<T>): string {
    const value = row[column.key];
    return column.customTooltip
      ? column.customTooltip(value, row)
      : String(value ?? '');
  }
}
