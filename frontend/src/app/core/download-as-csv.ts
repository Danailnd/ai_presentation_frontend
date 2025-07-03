export function downloadCSV<T extends object>(
  data: T[],
  filename = 'export.csv',
  delimiter = ',' // change to ';' for European Excel
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export.');
    return;
  }

  const header = Object.keys(data[0]);
  const csvRows = [
    header.join(delimiter),
    ...data.map((row) =>
      header
        .map((field) => {
          const value = row[field as keyof T];
          return `"${String(value ?? '').replace(/"/g, '""')}"`;
        })
        .join(delimiter)
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
