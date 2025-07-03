import { Tenant } from '../../../../../core/models/tenant.model';

// field-labels.ts
export const TENANT_FIELDS_METADATA: {
  [K in keyof Tenant]?: {
    label: string;
    format?: (value: Tenant[K]) => string;
  };
} = {
  name: { label: 'Tenant Name' },
  blocked: {
    label: 'Status',
    format: (val: boolean) => (val ? 'Blocked' : 'Active'),
  },
  mailReaderStopping: {
    label: 'Mail Reader',
    format: (val: boolean) => (val ? 'Stopped' : 'Running'),
  },
  externalReporting: {
    label: 'Sync to Reports',
    format: (val: boolean | undefined) =>
      val === true ? 'Enabled' : val === false ? 'Disabled' : 'Not Set',
  },

  googleDocAIEnabled: {
    label: 'Google Doc AI',
    format: (val: boolean) => (val ? 'Enabled' : 'Disabled'),
  },
  googleTranslationEnabled: {
    label: 'Google Translation',
    format: (val: boolean) => (val ? 'Enabled' : 'Disabled'),
  },
  masterDataCacheEnabled: {
    label: 'Master Data Cache',
    format: (val: boolean) => (val ? 'Enabled' : 'Disabled'),
  },
};
