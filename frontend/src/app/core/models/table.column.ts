export interface TableColumn<T> {
  key: keyof T;
  label: string;
  customCell?: (value: T[keyof T], row?: T) => string;
  customTooltip?: (value: T[keyof T], row?: T) => string;
  filterLabel?: (value: T[keyof T]) => string;
  copyable?: boolean;
  disableTooltip?: boolean;
}
