import { TableColumn } from '../../../../core/models/table.column';
import { Tenant } from '../../../../core/models/tenant.model';

export const tenantTableColumns: TableColumn<Tenant>[] = [
  { key: 'name', label: 'Name' },
  { key: 'id', label: 'ID', copyable: true, disableTooltip: true },
  {
    key: 'blocked',
    label: 'Blocked',
    customCell: (value) => (value === true ? 'lock' : ''),
    customTooltip: (value) =>
      typeof value === 'boolean' ? (value ? 'Blocked' : 'Unblocked') : '',
  },
  {
    key: 'mailReaderStopping',
    label: 'Mail Reader',
    customCell: (value) => (value === true ? 'close' : 'check'),
    customTooltip: (value) =>
      typeof value === 'boolean' ? (value ? 'Stopped' : 'Running') : '',
    filterLabel: (value) => (value ? 'Stopped' : 'Running'),
  },
  {
    key: 'googleDocAIEnabled',
    label: 'Google Doc AI',
    customCell: (value) => (value === true ? 'close' : 'check'),
    customTooltip: (value) =>
      typeof value === 'boolean' ? (value ? 'Disabled' : 'Enabled') : '',
    filterLabel: (value) => (value ? 'Disabled' : 'Enabled'),
  },
  {
    key: 'googleTranslationEnabled',
    label: 'Google Translation',
    customCell: (value) => (value === true ? 'close' : 'check'),
    customTooltip: (value) =>
      typeof value === 'boolean' ? (value ? 'Disabled' : 'Enabled') : '',
    filterLabel: (value) => (value ? 'Disabled' : 'Enabled'),
  },
  {
    key: 'masterDataCacheEnabled',
    label: 'Master Data Cache',
    customCell: (value) => (value === true ? 'close' : 'check'),
    customTooltip: (value) =>
      typeof value === 'boolean' ? (value ? 'Disabled' : 'Enabled') : '',
    filterLabel: (value) => (value ? 'Disabled' : 'Enabled'),
  },
];
