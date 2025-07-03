export interface Change<T> {
  field: keyof T;
  oldValue: T[keyof T];
  newValue: T[keyof T];
}
